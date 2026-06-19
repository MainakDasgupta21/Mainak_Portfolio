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

const ListExperience = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState("")
  const [pendingDelete, setPendingDelete] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get(backendUrl + "/api/experience/list")
      if (res.data.success) setList(res.data.experience || [])
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
        backendUrl + "/api/experience/remove",
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
        title="Experience"
        description="Manage experience entries."
        actions={
          <Link
            to="/experience/add"
            className="inline-flex h-9 items-center justify-center rounded-md border border-brand bg-brand px-3.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Add experience
          </Link>
        }
      />

      {loading ? <LoadingState label="Loading experience entries..." /> : null}
      {!loading && !list.length ? (
        <EmptyState title="No experience yet" message="Add your first experience entry to show your professional journey." />
      ) : null}

      {!loading && list.length ? (
        <DataTableCard
          headers={["Company", "Role", "Period", "Actions"]}
          gridClass="grid-cols-[2fr_1.6fr_1.1fr_130px]"
        >
          {list.map((item) => (
            <div
              className="grid grid-cols-1 gap-2 px-4 py-2.5 text-sm md:grid-cols-[2fr_1.6fr_1.1fr_130px] md:items-center hover:bg-surface-soft/60"
              key={item._id}
            >
              <div className="flex items-center gap-2">
                <img
                  className="h-9 w-9 rounded-md border border-border object-contain"
                  src={item.logo || "https://placehold.co/40?text=+"}
                  alt={item.company || "Company logo"}
                  loading="lazy"
                />
                <p className="font-medium text-text-main">{item.company}</p>
              </div>
              <p className="text-text-main">{item.role}</p>
              <p className="text-xs text-text-muted">{item.period || "-"}</p>
              <RowActions
                editTo={`/experience/${item._id}/edit`}
                onDelete={() => setPendingDelete(item)}
                busy={deletingId === item._id}
              />
            </div>
          ))}
        </DataTableCard>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete experience entry?"
        description={`This will permanently remove "${pendingDelete?.company || "this entry"}".`}
        confirmLabel="Delete entry"
        busy={Boolean(pendingDelete && deletingId === pendingDelete._id)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove(pendingDelete._id)}
      />
    </>
  )
}

export default ListExperience
