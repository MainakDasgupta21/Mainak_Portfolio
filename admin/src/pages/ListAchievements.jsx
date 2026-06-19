import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { backendUrl } from "../App"
import Button from "../components/ui/Button"
import ConfirmDialog from "../components/ui/ConfirmDialog"
import DataTableCard from "../components/ui/DataTableCard"
import EmptyState from "../components/ui/EmptyState"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"

const ListAchievements = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState("")
  const [pendingDelete, setPendingDelete] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get(backendUrl + "/api/achievement/list")
      if (res.data.success) setList(res.data.achievements || [])
      else toast.error(res.data.message)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    setDeletingId(id)
    try {
      const res = await axios.post(
        backendUrl + "/api/achievement/remove",
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
      setDeletingId("")
      setPendingDelete(null)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <PageHeader
        title="Achievements"
        description="Display awards and recognitions with short descriptions."
        actions={
          <Link
            to="/achievements/add"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-brand bg-brand px-4 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Add achievement
          </Link>
        }
      />

      {loading ? <LoadingState label="Loading achievements..." /> : null}
      {!loading && !list.length ? (
        <EmptyState title="No achievements yet" message="Add achievements to highlight milestones and awards." />
      ) : null}

      {!loading && list.length ? (
        <DataTableCard
          headers={["Icon", "Title", "Description", "Actions"]}
          gridClass="grid-cols-[100px_1.5fr_2.5fr_170px]"
        >
          {list.map((item) => (
            <div
              className="grid grid-cols-1 gap-3 px-4 py-3 text-sm md:grid-cols-[100px_1.5fr_2.5fr_170px] md:items-center"
              key={item._id}
            >
              <span className="inline-flex w-fit rounded-full bg-surface-soft px-2.5 py-1 text-xs font-medium text-text-muted">
                {item.icon}
              </span>
              <p className="font-medium text-text-main">{item.title}</p>
              <p className="text-text-muted">{item.description || "-"}</p>
              <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
                <Link
                  to={`/achievements/${item._id}/edit`}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-surface px-3 text-sm font-medium text-text-main transition-colors hover:bg-surface-soft"
                >
                  Edit
                </Link>
                <Button
                  variant="danger-soft"
                  size="sm"
                  onClick={() => setPendingDelete(item)}
                  disabled={deletingId === item._id}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </DataTableCard>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete achievement?"
        description={`This will permanently remove "${pendingDelete?.title || "this achievement"}".`}
        confirmLabel="Delete achievement"
        busy={Boolean(pendingDelete && deletingId === pendingDelete._id)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove(pendingDelete._id)}
      />
    </>
  )
}

export default ListAchievements
