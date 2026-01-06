export const calculateAge = (dateISO: string) => {
  const birth = new Date(dateISO)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDelta = today.getMonth() - birth.getMonth()
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }
  return Math.max(0, age)
}
export const formatHeightCm = (heightCm: number | null) => {
  if (!heightCm) {
    return null
  }
  return `${Math.floor(heightCm / 100)}m ${heightCm % 100}cm`
}
