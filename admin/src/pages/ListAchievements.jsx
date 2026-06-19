import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { backendUrl } from "../App"
import ConfirmDialog from "../components/ui/ConfirmDialog"
import DataTableCard from "../components/ui/DataTableCard"
import EmptyState from "../components/ui/EmptyState"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"
import RowActions from "../components/ui/RowActions"

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
        description="Manage awards and recognitions."
        actions={
          <Link
            to="/achievements/add"
            className="inline-flex h-9 items-center justify-center rounded-md border border-brand bg-brand px-3.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
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
          headers={["Title", "Icon", "Summary", "Actions"]}
          gridClass="grid-cols-[1.7fr_95px_2fr_130px]"
        >
          {list.map((item) => (
            <div
              className="grid grid-cols-1 gap-2 px-4 py-2.5 text-sm md:grid-cols-[1.7fr_95px_2fr_130px] md:items-center hover:bg-surface-soft/60"
              key={item._id}
            >
              <p className="font-medium text-text-main">{item.title}</p>
              <span className="inline-flex w-fit rounded-md bg-surface-soft px-2 py-0.5 text-xs text-text-muted">{item.icon}</span>
              <p className="text-xs text-text-muted truncate">{item.description || "No description"}</p>
              <RowActions
                editTo={`/achievements/${item._id}/edit`}
                onDelete={() => setPendingDelete(item)}
                busy={deletingId === item._id}
              />
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
