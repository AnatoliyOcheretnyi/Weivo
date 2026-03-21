import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import { createMMKV } from 'react-native-mmkv'

const storage = createMMKV({ id: 'weivo-supabase-auth' })

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

const createNoopClient = () =>
  createClient('https://invalid.supabase.local', 'invalid-anon-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: {
            getItem: async (key: string) => storage.getString(key) ?? null,
            setItem: async (key: string, value: string) => {
              storage.set(key, value)
            },
            removeItem: async (key: string) => {
              storage.remove(key)
            },
          },
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
    : createNoopClient()

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey)
