import { supabase } from '@/shared/services/supabase/client'

const USERNAME_MIN_LENGTH = 3
const USERNAME_MAX_LENGTH = 20
const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9._]{1,18}[a-z0-9])$/

const sanitize = (value: string) => value.toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, USERNAME_MAX_LENGTH)

const isValid = (value: string) => {
  if (value.length < USERNAME_MIN_LENGTH || value.length > USERNAME_MAX_LENGTH) {
    return false
  }
  return USERNAME_PATTERN.test(value)
}

const checkAvailability = async (username: string, userId: string) => {
  const { data, error } = await supabase.rpc('is_username_available', {
    p_username: username,
    p_exclude_user_id: userId,
  })

  if (error) {
    throw error
  }

  return Boolean(data)
}

export const usernameService = {
  sanitize,
  isValid,
  checkAvailability,
}

export const usernameRules = {
  minLength: USERNAME_MIN_LENGTH,
  maxLength: USERNAME_MAX_LENGTH,
}
