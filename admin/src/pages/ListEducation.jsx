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

const ListEducation = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState("")
  const [pendingDelete, setPendingDelete] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get(backendUrl + "/api/education/list")
      if (res.data.success) setList(res.data.education || [])
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
        backendUrl + "/api/education/remove",
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
        title="Education"
        description="Manage education timeline entries."
        actions={
          <Link
            to="/education/add"
            className="inline-flex h-9 items-center justify-center rounded-md border border-brand bg-brand px-3.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Add education
          </Link>
        }
      />

      {loading ? <LoadingState label="Loading education..." /> : null}
      {!loading && !list.length ? (
        <EmptyState title="No education entries yet" message="Add degree details to complete the profile timeline." />
      ) : null}

      {!loading && list.length ? (
        <DataTableCard
          headers={["Degree", "Institution", "Status", "Actions"]}
          gridClass="grid-cols-[1.9fr_1.6fr_100px_130px]"
        >
          {list.map((item) => (
            <div
              className="grid grid-cols-1 gap-2 px-4 py-2.5 text-sm md:grid-cols-[1.9fr_1.6fr_100px_130px] md:items-center hover:bg-surface-soft/60"
              key={item._id}
            >
              <div>
                <p className="font-medium text-text-main">{item.degree}{item.field ? ` in ${item.field}` : ""}</p>
                <p className="text-xs text-text-muted">{item.year || "-"}</p>
              </div>
              <p className="text-xs text-text-muted">{item.institution}{item.grade ? ` - ${item.grade}` : ""}</p>
              <span
                className={`inline-flex w-fit rounded-md px-2 py-0.5 text-xs ${
                  item.status === "Pursuing"
                    ? "bg-surface-soft text-text-main"
                    : "text-text-muted"
                }`}
              >
                {item.status}
              </span>
              <RowActions
                editTo={`/education/${item._id}/edit`}
                onDelete={() => setPendingDelete(item)}
                busy={deletingId === item._id}
              />
            </div>
          ))}
        </DataTableCard>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete education entry?"
        description={`This will permanently remove "${pendingDelete?.degree || "this education entry"}".`}
        confirmLabel="Delete entry"
        busy={Boolean(pendingDelete && deletingId === pendingDelete._id)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove(pendingDelete._id)}
      />
    </>
  )
}

export default ListEducation
