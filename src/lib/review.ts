export function maskReviewerName(name: string): string {
  const trimmed = name.trim()

  if (trimmed.length <= 1) {
    return trimmed
  }

  if (trimmed.length === 2) {
    return `${trimmed[0]}*`
  }

  const middleMask = '*'.repeat(trimmed.length - 2)
  return `${trimmed[0]}${middleMask}${trimmed[trimmed.length - 1]}`
}
