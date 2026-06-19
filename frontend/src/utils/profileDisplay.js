const normalizeString = (value) => (typeof value === "string" ? value.trim() : "")

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export function getProfileDisplayName(profile, fallbackName = "") {
  const name = normalizeString(profile?.name)
  const title = normalizeString(profile?.title)
  const fallback = normalizeString(fallbackName)

  if (name && title) {
    const hasTitleAlready = new RegExp(`\\b${escapeRegExp(title.toLowerCase())}\\b`).test(name.toLowerCase())
    if (hasTitleAlready) return name
    return `${name} ${title}`
  }

  return name || fallback || title
}
