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
    <div className="flex flex-col gap-2">
      {label ? <span className="text-xs font-medium text-text-muted">{label}</span> : null}
      <label
        htmlFor={id}
        title="Click to upload"
        className="inline-flex w-fit cursor-pointer self-start rounded-md focus-within:ring-2 focus-within:ring-brand/40"
      >
        <img
          className="h-16 w-16 rounded-md border border-border object-cover"
          src={previewUrl || currentUrl || fallbackSrc}
          alt=""
        />
        <input id={id} type="file" accept={accept} hidden onChange={(e) => onChange(e.target.files?.[0] || null)} />
      </label>
    </div>
  )
}

export default FilePicker
