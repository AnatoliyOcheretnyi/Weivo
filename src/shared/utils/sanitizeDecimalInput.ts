type SanitizeDecimalOptions = {
  maxDecimals?: number
}
export const sanitizeDecimalInput = (value: string, options: SanitizeDecimalOptions = {}) => {
  const { maxDecimals } = options
  const normalized = value.replace(',', '.')
  let result = ''
  let dotUsed = false
  let decimals = 0
  for (const char of normalized) {
    if (char >= '0' && char <= '9') {
      if (dotUsed && maxDecimals != null && decimals >= maxDecimals) {
        continue
      }
      result += char
      if (dotUsed) {
        decimals += 1
      }
      continue
    }
    if (char === '.' && !dotUsed) {
      dotUsed = true
      result += char
    }
  }
  return result
}
