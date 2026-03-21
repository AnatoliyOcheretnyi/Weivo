import { supabase } from '@/shared/services/supabase/client'
import type { FriendItem, FriendRequestItem, FriendUser } from './types'

type SearchRow = { user_id: string; username: string | null; avatar_url: string | null }
type RequestRow = {
  request_id: string
  direction: 'incoming' | 'outgoing'
  status: 'pending' | 'accepted' | 'declined' | 'cancelled'
  message: string | null
  created_at: string
  other_user_id: string
  other_username: string | null
  other_avatar_url: string | null
}
type FriendRow = {
  friendship_id: string
  friend_user_id: string
  friend_username: string | null
  friend_avatar_url: string | null
  shared_streak: number | null
  last_interaction_at: string | null
  created_at: string
}

const mapUser = (row: { userId: string; username: string | null; avatarUrl: string | null }): FriendUser => ({
  userId: row.userId,
  username: row.username ?? 'unknown',
  avatarUrl: row.avatarUrl ?? undefined,
})

const requireUserId = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

export const friendsService = {
  async ensureAuthenticated() {
    return Boolean(await requireUserId())
  },

  async searchUsers(query: string) {
    const trimmed = query.trim().toLowerCase()
    if (trimmed.length < 2) {
      return [] as FriendUser[]
    }
    const { data, error } = await supabase.rpc('search_users_for_friends', {
      p_query: trimmed,
      p_limit: 20,
    })
    if (error) {
      throw error
    }
    return ((data ?? []) as SearchRow[])
      .filter((row) => row.username)
      .map((row) =>
        mapUser({
          userId: row.user_id,
          username: row.username,
          avatarUrl: row.avatar_url,
        })
      )
  },

  async sendRequest(toUserId: string, message?: string) {
    const { error } = await supabase.rpc('send_friend_request', {
      p_to_user_id: toUserId,
      p_message: message ?? null,
    })
    if (error) {
      throw error
    }
  },

  async listRequests() {
    const { data, error } = await supabase.rpc('list_friend_requests')
    if (error) {
      throw error
    }
    return ((data ?? []) as RequestRow[]).map(
      (row): FriendRequestItem => ({
        requestId: row.request_id,
        direction: row.direction,
        status: row.status,
        message: row.message ?? undefined,
        createdAt: row.created_at,
        otherUser: mapUser({
          userId: row.other_user_id,
          username: row.other_username,
          avatarUrl: row.other_avatar_url,
        }),
      })
    )
  },

  async listFriends() {
    const { data, error } = await supabase.rpc('list_friends')
    if (error) {
      throw error
    }
    return ((data ?? []) as FriendRow[]).map(
      (row): FriendItem => ({
        friendshipId: row.friendship_id,
        sharedStreak: row.shared_streak ?? 0,
        lastInteractionAt: row.last_interaction_at ?? undefined,
        createdAt: row.created_at,
        user: mapUser({
          userId: row.friend_user_id,
          username: row.friend_username,
          avatarUrl: row.friend_avatar_url,
        }),
      })
    )
  },

  async respondToRequest(requestId: string, action: 'accept' | 'decline' | 'cancel') {
    const { error } = await supabase.rpc('respond_friend_request', {
      p_request_id: requestId,
      p_action: action,
    })
    if (error) {
      throw error
    }
  },
}
