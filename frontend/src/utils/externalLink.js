const EXTERNAL_PROTOCOL_RE = /^[a-z][a-z\d+.-]*:\/\//i
const LOCALHOST_RE = /^localhost(?::\d+)?(?:\/|$)/i
const IPV4_RE = /^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/|$)/
const DOMAIN_LIKE_RE = /^(?:[a-z\d-]+\.)+[a-z]{2,}(?::\d+)?(?:\/|$)/i

const looksLikeExternalHost = (value) =>
  LOCALHOST_RE.test(value) || IPV4_RE.test(value) || DOMAIN_LIKE_RE.test(value)

export const normalizeExternalLink = (value) => {
  if (typeof value !== "string") return ""
  const trimmed = value.trim()
  if (!trimmed) return ""

  let candidate = trimmed
  if (candidate.startsWith("//")) {
    candidate = `https:${candidate}`
  } else if (!EXTERNAL_PROTOCOL_RE.test(candidate) && looksLikeExternalHost(candidate)) {
    candidate = `https://${candidate}`
  }

  try {
    const parsed = new URL(candidate)
    const protocol = parsed.protocol.toLowerCase()
    if (protocol !== "http:" && protocol !== "https:") return ""
    return parsed.toString()
  } catch {
    return ""
  }
}

export const isValidExternalLink = (value) => Boolean(normalizeExternalLink(value))
