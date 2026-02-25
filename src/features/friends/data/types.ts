export type FriendUser = {
  userId: string
  username: string
  avatarUrl?: string
}
export type FriendRequestItem = {
  requestId: string
  direction: 'incoming' | 'outgoing'
  status: 'pending' | 'accepted' | 'declined' | 'cancelled'
  message?: string
  createdAt: string
  otherUser: FriendUser
}
export type FriendItem = {
  friendshipId: string
  sharedStreak: number
  lastInteractionAt?: string
  createdAt: string
  user: FriendUser
}
