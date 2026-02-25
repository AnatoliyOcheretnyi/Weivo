import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, ScrollView, Share, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Input } from '@/shared/components/Input'
import { Button } from '@/shared/components/Button'
import { useTexts } from '@/i18n'
import { useAppTheme } from '@/theme'
import { useProfileStore } from '@/features/profile'
import { friendsService } from '@/features/friends/data/friendsService'
import type { FriendItem, FriendRequestItem, FriendUser } from '@/features/friends/data/types'
import { createBuddiesStyles } from './BuddiesScreen.styles'

const formatDate = (value: string) => new Date(value).toLocaleDateString()

export default function BuddiesScreen() {
  const { texts } = useTexts()
  const { colors } = useAppTheme()
  const { profile } = useProfileStore()
  const styles = useMemo(() => createBuddiesStyles(colors), [colors])
  const searchInputRef = useRef<React.ComponentRef<typeof Input>>(null)
  const [isAuthed, setIsAuthed] = useState(false)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [busyRequestId, setBusyRequestId] = useState<string | null>(null)
  const [sendBusyUserId, setSendBusyUserId] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<FriendUser[]>([])
  const [requests, setRequests] = useState<FriendRequestItem[]>([])
  const [friends, setFriends] = useState<FriendItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const incoming = requests.filter((item) => item.status === 'pending' && item.direction === 'incoming')
  const outgoing = requests.filter((item) => item.status === 'pending' && item.direction === 'outgoing')

  const refreshOverview = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const authenticated = await friendsService.ensureAuthenticated()
      setIsAuthed(authenticated)
      if (!authenticated) {
        setRequests([])
        setFriends([])
        return
      }
      const [nextRequests, nextFriends] = await Promise.all([friendsService.listRequests(), friendsService.listFriends()])
      setRequests(nextRequests)
      setFriends(nextFriends)
    } catch {
      setError(texts.buddies.errors.load)
    } finally {
      setLoading(false)
    }
  }, [texts])

  useEffect(() => {
    void refreshOverview()
  }, [refreshOverview])

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setSearchResults([])
      return
    }
    setSearching(true)
    setError(null)
    try {
      const results = await friendsService.searchUsers(trimmed)
      setSearchResults(results)
    } catch {
      setError(texts.buddies.errors.search)
    } finally {
      setSearching(false)
    }
  }, [query, texts])

  const handleSendRequest = useCallback(
    async (user: FriendUser) => {
      setSendBusyUserId(user.userId)
      setError(null)
      try {
        await friendsService.sendRequest(user.userId)
        await refreshOverview()
      } catch {
        setError(texts.buddies.errors.send)
      } finally {
        setSendBusyUserId(null)
      }
    },
    [refreshOverview, texts]
  )

  const handleRequestAction = useCallback(
    async (requestId: string, action: 'accept' | 'decline' | 'cancel') => {
      setBusyRequestId(requestId)
      setError(null)
      try {
        await friendsService.respondToRequest(requestId, action)
        await refreshOverview()
      } catch {
        setError(texts.buddies.errors.action)
      } finally {
        setBusyRequestId(null)
      }
    },
    [refreshOverview, texts]
  )

  const handleInvite = useCallback(async () => {
    const username = profile.username?.trim()
    if (!username) {
      Alert.alert(texts.buddies.invite.missingUsernameTitle, texts.buddies.invite.missingUsernameBody)
      return
    }
    try {
      await Share.share({ message: texts.buddies.invite.shareMessage.replace('{username}', `@${username}`) })
    } catch {
      setError(texts.buddies.errors.invite)
    }
  }, [profile.username, texts])

  const focusSearch = useCallback(() => {
    searchInputRef.current?.focus?.()
  }, [])

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.badge}>{texts.buddies.badge}</Text>
          <Text style={styles.title}>{texts.buddies.title}</Text>
          <Text style={styles.subtitle}>{texts.buddies.subtitle}</Text>
          <View style={styles.actions}>
            <Button title={texts.buddies.actions.invite} variant="inverse" style={styles.action} onPress={handleInvite} />
            <Button title={texts.buddies.actions.findByUsername} style={styles.action} onPress={focusSearch} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{texts.buddies.search.title}</Text>
          <View style={styles.searchRow}>
            <Input
              ref={searchInputRef}
              variant="compact"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={texts.buddies.search.placeholder}
              containerStyle={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={() => void handleSearch()}
            />
            <Button title={searching ? texts.buddies.search.searching : texts.buddies.search.cta} onPress={() => void handleSearch()} disabled={searching || !isAuthed} />
          </View>
          {!isAuthed ? <Text style={styles.helper}>{texts.buddies.search.authRequired}</Text> : null}
          {searchResults.length > 0 ? (
            <View style={styles.list}>
              {searchResults.map((user) => (
                <View key={user.userId} style={styles.row}>
                  <View style={styles.rowMain}>
                    <Text style={styles.rowTitle}>@{user.username}</Text>
                  </View>
                  <Button
                    title={sendBusyUserId === user.userId ? texts.buddies.search.sending : texts.buddies.search.add}
                    onPress={() => void handleSendRequest(user)}
                    disabled={sendBusyUserId === user.userId}
                    variant="inverseSmall"
                    style={styles.miniBtn}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.helper}>{texts.buddies.search.helper}</Text>
          )}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{texts.buddies.requests.incomingTitle}</Text>
          {incoming.length === 0 ? (
            <Text style={styles.emptyText}>{texts.buddies.requests.emptyIncoming}</Text>
          ) : (
            <View style={styles.list}>
              {incoming.map((item) => (
                <View key={item.requestId} style={styles.row}>
                  <View style={styles.rowMain}>
                    <Text style={styles.rowTitle}>@{item.otherUser.username}</Text>
                    <Text style={styles.rowMeta}>{formatDate(item.createdAt)}</Text>
                  </View>
                  <View style={styles.rowActions}>
                    <Button
                      title={texts.buddies.requests.accept}
                      variant="primarySmall"
                      onPress={() => void handleRequestAction(item.requestId, 'accept')}
                      disabled={busyRequestId === item.requestId}
                    />
                    <Button
                      title={texts.buddies.requests.decline}
                      variant="inverseSmall"
                      onPress={() => void handleRequestAction(item.requestId, 'decline')}
                      disabled={busyRequestId === item.requestId}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{texts.buddies.requests.outgoingTitle}</Text>
          {outgoing.length === 0 ? (
            <Text style={styles.emptyText}>{texts.buddies.requests.emptyOutgoing}</Text>
          ) : (
            <View style={styles.list}>
              {outgoing.map((item) => (
                <View key={item.requestId} style={styles.row}>
                  <View style={styles.rowMain}>
                    <Text style={styles.rowTitle}>@{item.otherUser.username}</Text>
                    <Text style={styles.rowMeta}>{formatDate(item.createdAt)}</Text>
                  </View>
                  <Button
                    title={texts.buddies.requests.cancel}
                    variant="inverseSmall"
                    onPress={() => void handleRequestAction(item.requestId, 'cancel')}
                    disabled={busyRequestId === item.requestId}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{texts.buddies.friends.title}</Text>
          {friends.length === 0 ? (
            <Text style={styles.emptyText}>{texts.buddies.friends.empty}</Text>
          ) : (
            <View style={styles.list}>
              {friends.map((item) => (
                <View key={item.friendshipId} style={styles.row}>
                  <View style={styles.rowMain}>
                    <Text style={styles.rowTitle}>@{item.user.username}</Text>
                    <Text style={styles.rowMeta}>{texts.buddies.friends.streak.replace('{count}', String(item.sharedStreak))}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          {loading ? <Text style={styles.helper}>{texts.buddies.loading}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{texts.buddies.howItWorks.title}</Text>
          <View style={styles.step}><Text style={styles.stepNum}>1</Text><Text style={styles.stepText}>{texts.buddies.howItWorks.stepOne}</Text></View>
          <View style={styles.step}><Text style={styles.stepNum}>2</Text><Text style={styles.stepText}>{texts.buddies.howItWorks.stepTwo}</Text></View>
          <View style={styles.step}><Text style={styles.stepNum}>3</Text><Text style={styles.stepText}>{texts.buddies.howItWorks.stepThree}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.rewardTitle}>{texts.buddies.rewards.title}</Text>
          <Text style={styles.rewardText}>{texts.buddies.rewards.body}</Text>
          <Text style={styles.rewardHint}>{texts.buddies.rewards.hint}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
