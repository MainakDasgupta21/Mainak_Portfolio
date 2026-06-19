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
        description="Control academic timeline items and ordering."
        actions={
          <Link
            to="/education/add"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-brand bg-brand px-4 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
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
          headers={["Degree", "Institution", "Grade", "Year", "Status", "Actions"]}
          gridClass="grid-cols-[1.6fr_1.4fr_1fr_1fr_1fr_170px]"
        >
          {list.map((item) => (
            <div
              className="grid grid-cols-1 gap-3 px-4 py-3 text-sm md:grid-cols-[1.6fr_1.4fr_1fr_1fr_1fr_170px] md:items-center"
              key={item._id}
            >
              <p className="font-medium text-text-main">{item.degree}{item.field ? ` in ${item.field}` : ""}</p>
              <p className="text-text-muted">{item.institution}</p>
              <p className="text-text-muted">{item.grade || "-"}</p>
              <p className="text-text-muted">{item.year || "-"}</p>
              <span
                className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium ${
                  item.status === "Pursuing"
                    ? "bg-brand-soft text-brand"
                    : "bg-surface-soft text-text-muted"
                }`}
              >
                {item.status}
              </span>
              <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
                <Link
                  to={`/education/${item._id}/edit`}
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
