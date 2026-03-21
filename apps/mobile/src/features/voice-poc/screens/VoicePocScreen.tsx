import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { AudioContext, decodeAudioData } from 'react-native-audio-api'
import { Buffer } from 'buffer'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SkiaWeightChart, useWeightStore } from '@/features/weight'
import { AuroraBackground } from '@/shared/components/AuroraBackground/AuroraBackground'
import { useAppTheme } from '@/theme'
import { createVoicePocScreenStyles } from './VoicePocScreen.styles'

const DEFAULT_PROXY_WS_URL = 'ws://127.0.0.1:8000/ws/chat'
const DEFAULT_SAMPLE_RATE = 24000
const DEFAULT_CHUNK_MS = 256
const TOTAL_MOCK_CHUNKS = 160
const VOICE_ASSET_MODULE = require('../../../asset/sounds/voice.m4a')

type DecodedAudioLike = {
  sampleRate: number
  length: number
  numberOfChannels: number
  duration: number
  getChannelData: (channel: number) => Float32Array
}

type PreparedChunk = {
  seq: number
  sampleRate: number
  durationMs: number
  samples: Float32Array
}

type SimStats = {
  source: number
  emitted: number
  jitterEvents: number
  pauseEvents: number
  lossEvents: number
  reorderEvents: number
  duplicateEvents: number
  concealed: number
  lateDropped: number
}

type RuntimeStats = {
  chunksPlayed: number
  underruns: number
  queuedMs: number
}

type DegradationConfig = {
  enabledLoss: boolean
  enabledReorder: boolean
  enabledDuplicate: boolean
  enabledJitter: boolean
  enabledPause: boolean
  lossEveryN: number
  reorderEveryN: number
  duplicateEveryN: number
  duplicateDelayMs: number
  jitterEveryN: number
  jitterMs: number
  pauseEveryN: number
  pauseMs: number
  startupBufferMs: number
  concealment: 'silence' | 'repeat'
}

type NetworkPacket = {
  seq: number
  arrivalMs: number
  chunk: PreparedChunk
}

const emptyRuntimeStats: RuntimeStats = {
  chunksPlayed: 0,
  underruns: 0,
  queuedMs: 0,
}

const emptySimStats: SimStats = {
  source: 0,
  emitted: 0,
  jitterEvents: 0,
  pauseEvents: 0,
  lossEvents: 0,
  reorderEvents: 0,
  duplicateEvents: 0,
  concealed: 0,
  lateDropped: 0,
}

const defaultConfig: DegradationConfig = {
  enabledLoss: true,
  enabledReorder: true,
  enabledDuplicate: true,
  enabledJitter: true,
  enabledPause: true,
  lossEveryN: 18,
  reorderEveryN: 14,
  duplicateEveryN: 16,
  duplicateDelayMs: 60,
  jitterEveryN: 5,
  jitterMs: 90,
  pauseEveryN: 10,
  pauseMs: 220,
  startupBufferMs: 420,
  concealment: 'silence',
}

const shouldTriggerEveryN = (seq: number, everyN: number) => everyN > 0 && seq > 0 && seq % everyN === 0

const buildMockChunks = (chunkMs: number, sampleRate = DEFAULT_SAMPLE_RATE) => {
  const samplesPerChunk = Math.max(1, Math.floor((sampleRate * chunkMs) / 1000))
  const chunks: PreparedChunk[] = []
  let phase = 0
  const twoPi = Math.PI * 2

  for (let seq = 0; seq < TOTAL_MOCK_CHUNKS; seq += 1) {
    const samples = new Float32Array(samplesPerChunk)
    const hz = 220 + (seq % 12) * 35

    for (let i = 0; i < samplesPerChunk; i += 1) {
      phase += twoPi * (hz / sampleRate)
      if (phase >= twoPi) {
        phase -= twoPi
      }
      samples[i] = Math.sin(phase) * 0.2
    }

    chunks.push({
      seq,
      sampleRate,
      durationMs: (samplesPerChunk / sampleRate) * 1000,
      samples,
    })
  }

  return chunks
}

const buildChunksFromDecoded = (decoded: DecodedAudioLike, chunkMs: number) => {
  const sampleRate = decoded.sampleRate
  const frameCount = decoded.length
  const channelCount = Math.max(1, decoded.numberOfChannels)
  const perChunkFrames = Math.max(1, Math.floor((sampleRate * chunkMs) / 1000))
  const channels = Array.from({ length: channelCount }, (_, index) => decoded.getChannelData(index))
  const chunks: PreparedChunk[] = []

  for (let offset = 0, seq = 0; offset < frameCount; offset += perChunkFrames, seq += 1) {
    const end = Math.min(offset + perChunkFrames, frameCount)
    const frames = end - offset
    const samples = new Float32Array(frames)

    for (let i = 0; i < frames; i += 1) {
      let mixed = 0
      for (let ch = 0; ch < channelCount; ch += 1) {
        mixed += channels[ch][offset + i] ?? 0
      }
      samples[i] = Math.max(-1, Math.min(1, mixed / channelCount))
    }

    chunks.push({
      seq,
      sampleRate,
      durationMs: (frames / sampleRate) * 1000,
      samples,
    })
  }

  return chunks
}

const createSilenceChunk = (template: PreparedChunk, seq: number): PreparedChunk => ({
  seq,
  sampleRate: template.sampleRate,
  durationMs: template.durationMs,
  samples: new Float32Array(template.samples.length),
})

const simulateNetworkPackets = (chunks: PreparedChunk[], cfg: DegradationConfig) => {
  const packets: NetworkPacket[] = []
  let jitterEvents = 0
  let pauseEvents = 0
  let lossEvents = 0
  let reorderEvents = 0
  let duplicateEvents = 0

  let sendClockMs = 0

  for (const chunk of chunks) {
    sendClockMs += chunk.durationMs

    if (cfg.enabledPause && shouldTriggerEveryN(chunk.seq, cfg.pauseEveryN)) {
      sendClockMs += cfg.pauseMs
      pauseEvents += 1
    }

    if (cfg.enabledLoss && shouldTriggerEveryN(chunk.seq, cfg.lossEveryN)) {
      lossEvents += 1
      continue
    }

    let arrivalMs = sendClockMs
    if (cfg.enabledJitter && shouldTriggerEveryN(chunk.seq, cfg.jitterEveryN)) {
      const sign = Math.floor(chunk.seq / cfg.jitterEveryN) % 2 === 0 ? 1 : -1
      arrivalMs += sign * cfg.jitterMs
      jitterEvents += 1
    }

    packets.push({ seq: chunk.seq, arrivalMs, chunk })

    if (cfg.enabledDuplicate && shouldTriggerEveryN(chunk.seq, cfg.duplicateEveryN)) {
      const duplicateArrival = arrivalMs + cfg.duplicateDelayMs
      packets.push({ seq: chunk.seq, arrivalMs: duplicateArrival, chunk })
      duplicateEvents += 1
    }
  }

  if (cfg.enabledReorder) {
    for (let i = 0; i < packets.length - 1; i += 1) {
      if (shouldTriggerEveryN(packets[i].seq, cfg.reorderEveryN)) {
        const temp = packets[i].arrivalMs
        packets[i].arrivalMs = packets[i + 1].arrivalMs
        packets[i + 1].arrivalMs = temp
        reorderEvents += 1
      }
    }
  }

  packets.sort((a, b) => a.arrivalMs - b.arrivalMs)

  return {
    packets,
    jitterEvents,
    pauseEvents,
    lossEvents,
    reorderEvents,
    duplicateEvents,
  }
}

const reconstructWithJitterBuffer = (chunks: PreparedChunk[], cfg: DegradationConfig) => {
  const simulation = simulateNetworkPackets(chunks, cfg)
  const bySeq = new Map<number, PreparedChunk>()
  const output: PreparedChunk[] = []

  const template = chunks[0]
  if (!template) {
    return {
      output,
      stats: { ...emptySimStats },
    }
  }

  let packetIndex = 0
  let expectedSeq = 0
  let concealed = 0
  let lateDropped = 0
  let lastPlayed: PreparedChunk | null = null
  let waitSlotsForSeq = 0

  const chunkMs = template.durationMs
  const playoutStartMs = Math.max(cfg.startupBufferMs, chunkMs * 1.2)
  let playoutTimeMs = playoutStartMs
  const maxWaitSlotsBeforeSkip = cfg.enabledLoss
    ? Math.max(1, Math.round(900 / chunkMs))
    : Math.max(20, Math.round(5000 / chunkMs))

  while (expectedSeq < chunks.length) {
    while (packetIndex < simulation.packets.length && simulation.packets[packetIndex].arrivalMs <= playoutTimeMs) {
      const pkt = simulation.packets[packetIndex]
      if (pkt.seq < expectedSeq) {
        lateDropped += 1
      } else if (!bySeq.has(pkt.seq)) {
        bySeq.set(pkt.seq, pkt.chunk)
      }
      packetIndex += 1
    }

    const exact = bySeq.get(expectedSeq)
    if (exact) {
      bySeq.delete(expectedSeq)
      output.push(exact)
      lastPlayed = exact
      expectedSeq += 1
      waitSlotsForSeq = 0
      playoutTimeMs += chunkMs
      continue
    }

    concealed += 1
    if (cfg.concealment === 'repeat' && lastPlayed) {
      output.push({ ...lastPlayed, seq: expectedSeq })
    } else {
      output.push(createSilenceChunk(template, expectedSeq))
    }
    waitSlotsForSeq += 1
    playoutTimeMs += chunkMs

    // For loss mode we eventually skip truly missing seq; otherwise keep waiting.
    if (waitSlotsForSeq >= maxWaitSlotsBeforeSkip) {
      expectedSeq += 1
      waitSlotsForSeq = 0
    }
  }

  return {
    output,
    stats: {
      source: chunks.length,
      emitted: output.length,
      jitterEvents: simulation.jitterEvents,
      pauseEvents: simulation.pauseEvents,
      lossEvents: simulation.lossEvents,
      reorderEvents: simulation.reorderEvents,
      duplicateEvents: simulation.duplicateEvents,
      concealed,
      lateDropped,
    },
  }
}

export function VoicePocScreen() {
  const { entries } = useWeightStore()
  const { colors } = useAppTheme()
  const styles = useMemo(() => createVoicePocScreenStyles(colors), [colors])

  const audioContextRef = useRef<AudioContext | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const nextStartTimeRef = useRef(0)
  const activeSourcesRef = useRef<Array<{ stop: (when?: number) => void; disconnect?: () => void }>>([])
  const playbackTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const originalSourceRef = useRef<{ stop: () => void } | null>(null)
  const originalEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const originalAudioBufferRef = useRef<DecodedAudioLike | null>(null)
  const runtimeStatsRef = useRef<RuntimeStats>(emptyRuntimeStats)
  const chunksRef = useRef<PreparedChunk[]>(buildMockChunks(DEFAULT_CHUNK_MS))

  const [wsUrl, setWsUrl] = useState(DEFAULT_PROXY_WS_URL)
  const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
  const [lastError, setLastError] = useState<string | null>(null)
  const [playingScenario, setPlayingScenario] = useState<'none' | 'clean' | 'degraded' | 'original'>('none')
  const [chunkSourceLabel, setChunkSourceLabel] = useState('mock-tone')
  const [chunkMs, setChunkMs] = useState(DEFAULT_CHUNK_MS)
  const [cfg, setCfg] = useState<DegradationConfig>(defaultConfig)

  const clearPlaybackTimers = useCallback(() => {
    playbackTimersRef.current.forEach((timerId) => clearTimeout(timerId))
    playbackTimersRef.current = []
  }, [])

  const stopScheduledSources = useCallback(() => {
    activeSourcesRef.current.forEach((source) => {
      try {
        source.stop(0)
      } catch {
        // no-op
      }
      try {
        source.disconnect?.()
      } catch {
        // no-op
      }
    })
    activeSourcesRef.current = []
  }, [])

  const stopOriginalPlayback = useCallback(() => {
    if (originalEndTimerRef.current) {
      clearTimeout(originalEndTimerRef.current)
      originalEndTimerRef.current = null
    }
    if (originalSourceRef.current) {
      try {
        originalSourceRef.current.stop()
      } catch {
        // no-op
      }
      originalSourceRef.current = null
    }
  }, [])

  const stopPlayback = useCallback(() => {
    clearPlaybackTimers()
    stopScheduledSources()
    stopOriginalPlayback()
    nextStartTimeRef.current = 0
    setPlayingScenario('none')
  }, [clearPlaybackTimers, stopOriginalPlayback, stopScheduledSources])

  const getAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    await audioContextRef.current.resume()
    return audioContextRef.current
  }, [])

  const playMergedChunks = useCallback(
    async (chunks: PreparedChunk[]) => {
      if (chunks.length === 0) {
        return 0
      }

      const audioContext = await getAudioContext()
      const baseRate = chunks[0].sampleRate
      const totalFrames = chunks.reduce((sum, chunk) => sum + chunk.samples.length, 0)
      const merged = new Float32Array(totalFrames)
      let offset = 0
      for (const chunk of chunks) {
        merged.set(chunk.samples, offset)
        offset += chunk.samples.length
      }

      const audioBuffer = audioContext.createBuffer(1, merged.length, baseRate)
      audioBuffer.copyToChannel(merged, 0)

      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)
      activeSourcesRef.current.push(source as unknown as { stop: (when?: number) => void; disconnect?: () => void })

      const now = audioContext.currentTime
      const hadUnderrun = nextStartTimeRef.current < now - 0.02
      const startAt = Math.max(now, nextStartTimeRef.current)
      source.start(startAt)
      nextStartTimeRef.current = startAt + audioBuffer.duration

      runtimeStatsRef.current = {
        chunksPlayed: runtimeStatsRef.current.chunksPlayed + chunks.length,
        underruns: runtimeStatsRef.current.underruns + (hadUnderrun ? 1 : 0),
        queuedMs: Math.max(0, Math.round((nextStartTimeRef.current - now) * 1000)),
      }

      return audioBuffer.duration
    },
    [getAudioContext]
  )

  const enqueuePcm16Base64 = useCallback(
    async (base64Pcm: string, sampleRate = DEFAULT_SAMPLE_RATE) => {
      const pcmBuffer = Buffer.from(base64Pcm, 'base64')
      if (pcmBuffer.byteLength < 2) {
        return
      }
      const frameCount = Math.floor(pcmBuffer.byteLength / 2)
      const int16Array = new Int16Array(pcmBuffer.buffer, pcmBuffer.byteOffset, frameCount)
      const samples = new Float32Array(frameCount)
      for (let i = 0; i < frameCount; i += 1) {
        samples[i] = int16Array[i] / 32768
      }
      await playMergedChunks([
        {
          seq: -1,
          sampleRate,
          durationMs: (frameCount / sampleRate) * 1000,
          samples,
        },
      ])
    },
    [playMergedChunks]
  )

  const finalizeRun = useCallback(() => {
    setPlayingScenario('none')
  }, [])

  const startScenario = useCallback(
    async (mode: 'clean' | 'degraded') => {
      const source = [...chunksRef.current]
      if (source.length === 0) {
        setLastError('No chunks available.')
        return
      }

      stopPlayback()
      setLastError(null)
      setPlayingScenario(mode)
      runtimeStatsRef.current = { ...emptyRuntimeStats }
      nextStartTimeRef.current = 0

      const scenario =
        mode === 'clean'
          ? {
              output: source,
              stats: { ...emptySimStats, source: source.length, emitted: source.length },
            }
          : reconstructWithJitterBuffer(source, cfg)

      const durationSec = await playMergedChunks(scenario.output)
      const timerId = setTimeout(() => {
        finalizeRun()
      }, Math.max(120, Math.round(durationSec * 1000 + 40)))
      playbackTimersRef.current.push(timerId)
    },
    [cfg, finalizeRun, playMergedChunks, stopPlayback]
  )

  const playOriginalAudio = useCallback(async () => {
    if (!originalAudioBufferRef.current) {
      setLastError('Load voice file first.')
      return
    }

    stopPlayback()
    setLastError(null)
    setPlayingScenario('original')
    runtimeStatsRef.current = { ...emptyRuntimeStats }

    const audioContext = await getAudioContext()
    const source = audioContext.createBufferSource()
    source.buffer = originalAudioBufferRef.current as never
    source.connect(audioContext.destination)
    source.start(audioContext.currentTime)
    originalSourceRef.current = source as unknown as { stop: () => void }

    const durationMs = Math.round((originalAudioBufferRef.current.duration ?? 0) * 1000)
    originalEndTimerRef.current = setTimeout(() => {
      finalizeRun()
    }, Math.max(120, durationMs + 40))
  }, [finalizeRun, getAudioContext, stopPlayback])

  const rebuildChunks = useCallback((nextChunkMs: number) => {
    setChunkMs(nextChunkMs)
    if (originalAudioBufferRef.current) {
      chunksRef.current = buildChunksFromDecoded(originalAudioBufferRef.current, nextChunkMs)
    } else {
      chunksRef.current = buildMockChunks(nextChunkMs)
    }
  }, [])

  const loadVoiceChunks = useCallback(async () => {
    try {
      setLastError(null)
      const decoded = (await decodeAudioData(VOICE_ASSET_MODULE)) as unknown as DecodedAudioLike
      originalAudioBufferRef.current = decoded
      chunksRef.current = buildChunksFromDecoded(decoded, chunkMs)
      setChunkSourceLabel('voice.m4a')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to decode voice file.'
      setLastError(message)
    }
  }, [chunkMs])

  const useMockChunks = useCallback(() => {
    originalAudioBufferRef.current = null
    chunksRef.current = buildMockChunks(chunkMs)
    setChunkSourceLabel('mock-tone')
  }, [chunkMs])

  const toggleCfg = useCallback((key: keyof DegradationConfig) => {
    setCfg((prev) => {
      const value = prev[key]
      if (typeof value !== 'boolean') {
        return prev
      }
      return { ...prev, [key]: !value }
    })
  }, [])

  const setConcealment = useCallback((concealment: 'silence' | 'repeat') => {
    setCfg((prev) => ({ ...prev, concealment }))
  }, [])

  const adjustCfgInt = useCallback(
    (
      key:
        | 'lossEveryN'
        | 'reorderEveryN'
        | 'duplicateEveryN'
        | 'duplicateDelayMs'
        | 'jitterEveryN'
        | 'jitterMs'
        | 'pauseEveryN'
        | 'pauseMs'
        | 'startupBufferMs',
      delta: number,
      min: number,
      max: number
    ) => {
      setCfg((prev) => ({ ...prev, [key]: Math.max(min, Math.min(max, prev[key] + delta)) }))
    },
    []
  )

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setConnectionState('idle')
  }, [])

  const connectSocket = useCallback(() => {
    if (!wsUrl.trim()) {
      setLastError('Set WS URL first.')
      return
    }

    disconnect()
    setLastError(null)
    setConnectionState('connecting')
    const socket = new WebSocket(wsUrl.trim())
    wsRef.current = socket

    socket.onopen = () => {
      setConnectionState('connected')
      void getAudioContext()
    }

    socket.onmessage = (event) => {
      try {
        if (typeof event.data !== 'string') {
          return
        }
        const payload = JSON.parse(event.data) as { type?: string; data?: string; sampleRate?: number }
        if (payload.type !== 'audio' || typeof payload.data !== 'string') {
          return
        }
        const rate = typeof payload.sampleRate === 'number' ? payload.sampleRate : DEFAULT_SAMPLE_RATE
        void enqueuePcm16Base64(payload.data, rate)
      } catch {
        setLastError('Invalid WS payload format.')
      }
    }

    socket.onerror = () => {
      setConnectionState('error')
      setLastError('WebSocket error.')
    }

    socket.onclose = () => {
      wsRef.current = null
      setConnectionState((prev) => (prev === 'error' ? 'error' : 'idle'))
    }
  }, [disconnect, enqueuePcm16Base64, getAudioContext, wsUrl])

  useEffect(() => {
    return () => {
      stopPlayback()
      disconnect()
      if (audioContextRef.current) {
        void audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [disconnect, stopPlayback])

  const chunkSizeOptions = [80, 120, 256, 320]

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <AuroraBackground />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.chartBlock}>
          <SkiaWeightChart data={entries} />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Voice POC</Text>
          <Text style={styles.body}>Deterministic artifact simulation: each artifact has ON/OFF + every N + amount.</Text>

          <TextInput
            value={wsUrl}
            onChangeText={setWsUrl}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="ws://host:port/ws/chat"
            placeholderTextColor={colors.creamMuted}
          />

          <View style={styles.controlsRow}>
            <Pressable
              onPress={connectionState === 'connected' ? disconnect : connectSocket}
              style={[styles.button, connectionState === 'connected' ? styles.buttonDanger : styles.buttonPrimary]}>
              <Text style={styles.buttonText}>{connectionState === 'connected' ? 'Disconnect WS' : 'Connect WS'}</Text>
            </Pressable>
            <Pressable onPress={stopPlayback} style={[styles.button, styles.buttonGhost]}>
              <Text style={styles.buttonText}>Stop Playback</Text>
            </Pressable>
          </View>

          <View style={styles.controlsRow}>
            <Pressable onPress={() => void startScenario('clean')} style={[styles.button, styles.buttonPrimary]}>
              <Text style={styles.buttonText}>Play Clean</Text>
            </Pressable>
            <Pressable onPress={() => void startScenario('degraded')} style={[styles.button, styles.buttonDanger]}>
              <Text style={styles.buttonText}>Play Degraded</Text>
            </Pressable>
          </View>

          <View style={styles.controlsRow}>
            <Pressable onPress={() => void playOriginalAudio()} style={[styles.button, styles.buttonSecondary]}>
              <Text style={styles.buttonText}>Play Original</Text>
            </Pressable>
            <Pressable onPress={() => void loadVoiceChunks()} style={[styles.button, styles.buttonSecondary]}>
              <Text style={styles.buttonText}>Load Voice File</Text>
            </Pressable>
          </View>

          <View style={styles.controlsRow}>
            <Pressable onPress={useMockChunks} style={[styles.button, styles.buttonGhost]}>
              <Text style={styles.buttonText}>Use Mock</Text>
            </Pressable>
          </View>

          <View style={styles.configBlock}>
            <Text style={styles.metricLine}>Chunk size (ms)</Text>
            <View style={styles.controlsRow}>
              {chunkSizeOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => rebuildChunks(option)}
                  style={[styles.tinyButton, chunkMs === option ? styles.buttonPrimary : styles.buttonGhost]}>
                  <Text style={styles.buttonText}>{option}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.metricLine}>Simulate problems</Text>
            <View style={styles.controlsRow}>
              <Pressable onPress={() => toggleCfg('enabledLoss')} style={[styles.tinyButton, cfg.enabledLoss ? styles.buttonDanger : styles.buttonGhost]}>
                <Text style={styles.buttonText}>Loss</Text>
              </Pressable>
              <Pressable onPress={() => toggleCfg('enabledReorder')} style={[styles.tinyButton, cfg.enabledReorder ? styles.buttonDanger : styles.buttonGhost]}>
                <Text style={styles.buttonText}>Reorder</Text>
              </Pressable>
              <Pressable onPress={() => toggleCfg('enabledDuplicate')} style={[styles.tinyButton, cfg.enabledDuplicate ? styles.buttonDanger : styles.buttonGhost]}>
                <Text style={styles.buttonText}>Dup</Text>
              </Pressable>
              <Pressable onPress={() => toggleCfg('enabledJitter')} style={[styles.tinyButton, cfg.enabledJitter ? styles.buttonDanger : styles.buttonGhost]}>
                <Text style={styles.buttonText}>Jitter</Text>
              </Pressable>
              <Pressable onPress={() => toggleCfg('enabledPause')} style={[styles.tinyButton, cfg.enabledPause ? styles.buttonDanger : styles.buttonGhost]}>
                <Text style={styles.buttonText}>Pause</Text>
              </Pressable>
            </View>

            <Text style={styles.metricLine}>Gap concealment</Text>
            <View style={styles.controlsRow}>
              <Pressable onPress={() => setConcealment('repeat')} style={[styles.tinyButton, cfg.concealment === 'repeat' ? styles.buttonPrimary : styles.buttonGhost]}>
                <Text style={styles.buttonText}>Repeat</Text>
              </Pressable>
              <Pressable onPress={() => setConcealment('silence')} style={[styles.tinyButton, cfg.concealment === 'silence' ? styles.buttonPrimary : styles.buttonGhost]}>
                <Text style={styles.buttonText}>Silence</Text>
              </Pressable>
            </View>

            <Text style={styles.metricLine}>Artifact tuning</Text>
            <View style={styles.configRow}>
              <Text style={styles.metricLine}>Jitter: every {cfg.jitterEveryN}, ±{cfg.jitterMs}ms</Text>
              <View style={styles.adjustRow}>
                <Pressable onPress={() => adjustCfgInt('jitterEveryN', -1, 1, 50)} style={[styles.adjustButton, styles.buttonGhost]}><Text style={styles.buttonText}>N-</Text></Pressable>
                <Pressable onPress={() => adjustCfgInt('jitterEveryN', 1, 1, 50)} style={[styles.adjustButton, styles.buttonPrimary]}><Text style={styles.buttonText}>N+</Text></Pressable>
                <Pressable onPress={() => adjustCfgInt('jitterMs', -10, 0, 400)} style={[styles.adjustButton, styles.buttonGhost]}><Text style={styles.buttonText}>A-</Text></Pressable>
                <Pressable onPress={() => adjustCfgInt('jitterMs', 10, 0, 400)} style={[styles.adjustButton, styles.buttonPrimary]}><Text style={styles.buttonText}>A+</Text></Pressable>
              </View>
            </View>
            <View style={styles.configRow}>
              <Text style={styles.metricLine}>Pause: every {cfg.pauseEveryN}, {cfg.pauseMs}ms</Text>
              <View style={styles.adjustRow}>
                <Pressable onPress={() => adjustCfgInt('pauseEveryN', -1, 1, 50)} style={[styles.adjustButton, styles.buttonGhost]}><Text style={styles.buttonText}>N-</Text></Pressable>
                <Pressable onPress={() => adjustCfgInt('pauseEveryN', 1, 1, 50)} style={[styles.adjustButton, styles.buttonPrimary]}><Text style={styles.buttonText}>N+</Text></Pressable>
                <Pressable onPress={() => adjustCfgInt('pauseMs', -20, 0, 1200)} style={[styles.adjustButton, styles.buttonGhost]}><Text style={styles.buttonText}>A-</Text></Pressable>
                <Pressable onPress={() => adjustCfgInt('pauseMs', 20, 0, 1200)} style={[styles.adjustButton, styles.buttonPrimary]}><Text style={styles.buttonText}>A+</Text></Pressable>
              </View>
            </View>
            <View style={styles.configRow}>
              <Text style={styles.metricLine}>Loss: every {cfg.lossEveryN}</Text>
              <View style={styles.adjustRow}>
                <Pressable onPress={() => adjustCfgInt('lossEveryN', -1, 1, 100)} style={[styles.adjustButton, styles.buttonGhost]}><Text style={styles.buttonText}>N-</Text></Pressable>
                <Pressable onPress={() => adjustCfgInt('lossEveryN', 1, 1, 100)} style={[styles.adjustButton, styles.buttonPrimary]}><Text style={styles.buttonText}>N+</Text></Pressable>
              </View>
            </View>
            <View style={styles.configRow}>
              <Text style={styles.metricLine}>Reorder: every {cfg.reorderEveryN}</Text>
              <View style={styles.adjustRow}>
                <Pressable onPress={() => adjustCfgInt('reorderEveryN', -1, 1, 100)} style={[styles.adjustButton, styles.buttonGhost]}><Text style={styles.buttonText}>N-</Text></Pressable>
                <Pressable onPress={() => adjustCfgInt('reorderEveryN', 1, 1, 100)} style={[styles.adjustButton, styles.buttonPrimary]}><Text style={styles.buttonText}>N+</Text></Pressable>
              </View>
            </View>
            <View style={styles.configRow}>
              <Text style={styles.metricLine}>Dup: every {cfg.duplicateEveryN}, +{cfg.duplicateDelayMs}ms</Text>
              <View style={styles.adjustRow}>
                <Pressable onPress={() => adjustCfgInt('duplicateEveryN', -1, 1, 100)} style={[styles.adjustButton, styles.buttonGhost]}><Text style={styles.buttonText}>N-</Text></Pressable>
                <Pressable onPress={() => adjustCfgInt('duplicateEveryN', 1, 1, 100)} style={[styles.adjustButton, styles.buttonPrimary]}><Text style={styles.buttonText}>N+</Text></Pressable>
                <Pressable onPress={() => adjustCfgInt('duplicateDelayMs', -10, 0, 400)} style={[styles.adjustButton, styles.buttonGhost]}><Text style={styles.buttonText}>A-</Text></Pressable>
                <Pressable onPress={() => adjustCfgInt('duplicateDelayMs', 10, 0, 400)} style={[styles.adjustButton, styles.buttonPrimary]}><Text style={styles.buttonText}>A+</Text></Pressable>
              </View>
            </View>
          </View>

          <View style={styles.metricsCard}>
            <Text style={styles.metricLine}>Chunk source: {chunkSourceLabel}</Text>
            <Text style={styles.metricLine}>WS: {connectionState}</Text>
            <Text style={styles.metricLine}>Playback mode: {playingScenario}</Text>
            <Text style={styles.metricLine}>Chunks loaded: {chunksRef.current.length}</Text>
            <Text style={styles.metricLine}>Startup buffer: {cfg.startupBufferMs}ms</Text>
            {lastError ? <Text style={styles.metricError}>Error: {lastError}</Text> : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
