import { useEffect, useMemo } from "react"

const FilePicker = ({ id, file, onChange, fallbackSrc, label, currentUrl = "", accept = "" }) => {
  const previewUrl = useMemo(() => {
    if (!file) return ""
    return URL.createObjectURL(file)
  }, [file])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <label htmlFor={id} className="flex cursor-pointer flex-col gap-2">
      {label ? <span className="text-xs font-medium text-text-muted">{label}</span> : null}
      <img
        className="h-20 w-20 rounded-xl border border-border object-cover"
        src={previewUrl || currentUrl || fallbackSrc}
        alt=""
      />
      <input id={id} type="file" accept={accept} hidden onChange={(e) => onChange(e.target.files?.[0] || null)} />
    </label>
  )
}

export default FilePicker
