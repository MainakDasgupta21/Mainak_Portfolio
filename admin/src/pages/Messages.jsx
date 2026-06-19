import { useEffect, useState } from "react"
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

const Messages = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [busyId, setBusyId] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        backendUrl + "/api/contact/list",
        {},
        { headers: { token } }
      )
      if (res.data.success) setList(res.data.contacts || [])
      else toast.error(res.data.message)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    setBusyId(id)
    try {
      const res = await axios.post(
        backendUrl + "/api/contact/remove",
        { id },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        await load()
      } else toast.error(res.data.message)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBusyId("")
      setPendingDelete(null)
    }
  }

  const setStatus = async (id, status) => {
    setBusyId(id)
    try {
      const res = await axios.post(
        backendUrl + "/api/contact/status",
        { id, status },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success(status === "read" ? "Marked as read" : "Marked as new")
        await load()
      } else toast.error(res.data.message)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setBusyId("")
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <PageHeader
        title="Messages"
        description="Review and manage contact form submissions."
      />

      {loading ? <LoadingState label="Loading messages..." /> : null}
      {!loading && !list.length ? (
        <EmptyState title="Inbox is empty" message="New contact form submissions will appear here." />
      ) : null}

      {!loading
        ? list.map((message) => (
            <Card
              key={message._id}
              className="mb-3 grid grid-cols-1 gap-4 p-4 text-sm sm:grid-cols-[52px_1.8fr_1fr_220px] sm:items-start"
            >
              <img className="w-10" src={assets.parcel_icon} alt="" />
              <div>
                <p className="text-base font-semibold text-text-main">{message.name}</p>
                <p className="text-text-muted">{message.email}</p>
                {message.subject ? (
                  <p className="mt-2 text-sm text-text-main">
                    <span className="font-medium">Subject:</span> {message.subject}
                  </p>
                ) : null}
                <p className="mt-2 whitespace-pre-wrap text-sm text-text-muted">{message.message}</p>
              </div>
              <div className="text-xs text-text-muted">
                <p>Date: {new Date(message.date).toLocaleString()}</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    message.status === "new"
                      ? "bg-brand-soft text-brand"
                      : "bg-surface-soft text-text-muted"
                  }`}
                >
                  {message.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
                {message.status === "new" ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setStatus(message._id, "read")}
                    disabled={busyId === message._id}
                  >
                    Mark read
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatus(message._id, "new")}
                    disabled={busyId === message._id}
                  >
                    Mark new
                  </Button>
                )}
                <Button
                  variant="danger-soft"
                  size="sm"
                  onClick={() => setPendingDelete(message)}
                  disabled={busyId === message._id}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))
        : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete message?"
        description={`This will permanently remove the message from "${pendingDelete?.name || "this sender"}".`}
        confirmLabel="Delete message"
        busy={Boolean(pendingDelete && busyId === pendingDelete._id)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove(pendingDelete._id)}
      />
    </>
  )
}

export default Messages
