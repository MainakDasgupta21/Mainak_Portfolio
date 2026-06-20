import { Fragment } from "react"

const TOKEN_RE = /(\*\*[^*]+\*\*|\*[^*]+\*)/g
const BOLD_RE = /^\*\*[^*]+\*\*$/
const ITALIC_RE = /^\*[^*]+\*$/

export const InlineMarkdown = ({ text }) => {
  if (!text) return null

  return String(text).split(TOKEN_RE).map((part, index) => {
    if (BOLD_RE.test(part)) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }

    if (ITALIC_RE.test(part)) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }

    return <Fragment key={index}>{part}</Fragment>
  })
}
