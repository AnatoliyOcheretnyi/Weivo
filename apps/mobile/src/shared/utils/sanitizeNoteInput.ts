const NOTE_ALLOWED_CHAR = /[\p{L}\p{M}\p{Zs}\p{Extended_Pictographic}.,!?]/u
export const sanitizeNoteInput = (value: string, maxLength: number) => {
  const filtered = Array.from(value)
    .filter((char) => NOTE_ALLOWED_CHAR.test(char))
    .join('')
  return filtered.slice(0, maxLength)
}
