import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { backendUrl } from "../App"
import { assets } from "../assets/assets"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import ConfirmDialog from "../components/ui/ConfirmDialog"
import EmptyState from "../components/ui/EmptyState"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"

const Media = ({ token }) => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busyDeleteId, setBusyDeleteId] = useState("")
  const [pendingDelete, setPendingDelete] = useState(null)
  const [list, setList] = useState([])

  const previewUrl = useMemo(() => {
    if (!file || !file.type?.startsWith("image/")) return ""
    return URL.createObjectURL(file)
  }, [file])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const loadMedia = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        backendUrl + "/api/media/list",
        {},
        { headers: { token } }
      )
      if (res.data.success) setList(res.data.media || [])
      else toast.error(res.data.message)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMedia()
  }, [])

  const onUpload = async (e) => {
    e.preventDefault()
    if (!file) return toast.error("Choose a file first")
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await axios.post(
        backendUrl + "/api/media/upload",
        fd,
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success("Uploaded")
        setFile(null)
        await loadMedia()
      } else toast.error(res.data.message)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUploading(false)
    }
  }

  const copy = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("URL copied")
    } catch (error) {
      toast.error("Failed to copy URL")
    }
  }

  const remove = async (item) => {
    setBusyDeleteId(item._id)
    try {
      const res = await axios.post(
        backendUrl + "/api/media/remove",
        { id: item._id, publicId: item.publicId, type: item.type },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        await loadMedia()
      } else toast.error(res.data.message)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBusyDeleteId("")
      setPendingDelete(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Media Library"
        description="Upload and reuse Cloudinary assets for profile, projects, and testimonials."
      />

      <Card className="mb-6 p-4">
        <form onSubmit={onUpload} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="mediaFile" className="cursor-pointer">
            <img
              className="h-16 w-16 rounded-xl border border-border object-cover"
              src={previewUrl || assets.upload_area}
              alt="Selected upload preview"
            />
            <input
              id="mediaFile"
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-main">
              {file ? file.name : "Choose an image, video, or PDF"}
            </p>
            <p className="text-xs text-text-muted">
              Image / video / raw uploads are auto-detected from mime type.
            </p>
          </div>
          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </Card>

      {loading ? <LoadingState label="Loading media library..." /> : null}
      {!loading && !list.length ? (
        <EmptyState title="No media uploaded yet" message="Uploaded assets will appear here with copy and delete actions." />
      ) : null}

      {!loading && list.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((item) => (
            <Card key={item._id} className="p-3">
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.originalName || "Uploaded media"}
                  className="h-36 w-full rounded-xl border border-border object-cover"
                  loading="lazy"
                />
              ) : null}
              {item.type === "video" ? (
                <video src={item.url} controls className="h-36 w-full rounded-xl border border-border object-cover" />
              ) : null}
              {item.type === "raw" ? (
                <div className="flex h-36 w-full items-center justify-center rounded-xl border border-border bg-surface-soft text-sm text-text-muted">
                  Raw file
                </div>
              ) : null}
              <p className="mt-2 break-all text-xs text-text-muted">{item.url}</p>
              <p className="mt-1 text-xs text-text-muted">
                {item.originalName} - {Math.max(1, Math.round((item.bytes || 0) / 1024))} KB
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button onClick={() => copy(item.url)} variant="secondary" size="sm">
                  Copy URL
                </Button>
                <Button
                  onClick={() => setPendingDelete(item)}
                  variant="danger-soft"
                  size="sm"
                  disabled={busyDeleteId === item._id}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete media file?"
        description={`This will permanently remove "${pendingDelete?.originalName || "this file"}" from Cloudinary.`}
        confirmLabel="Delete file"
        busy={Boolean(pendingDelete && busyDeleteId === pendingDelete._id)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove(pendingDelete)}
      />
    </>
  )
}

export default Media
