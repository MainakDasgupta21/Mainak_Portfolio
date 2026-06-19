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

const ListTestimonials = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState("")
  const [pendingDelete, setPendingDelete] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get(backendUrl + "/api/testimonial/list")
      if (res.data.success) setList(res.data.testimonials || [])
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
        backendUrl + "/api/testimonial/remove",
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
        title="Testimonials"
        description="Manage social proof entries displayed on the public site."
        actions={
          <Link
            to="/testimonials/add"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-brand bg-brand px-4 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Add testimonial
          </Link>
        }
      />
      {loading ? <LoadingState label="Loading testimonials..." /> : null}
      {!loading && !list.length ? (
        <EmptyState title="No testimonials yet" message="Add testimonials to build trust on your portfolio." />
      ) : null}
      {!loading && list.length ? (
        <DataTableCard
          headers={["Avatar", "Person", "Quote", "Rating", "Actions"]}
          gridClass="grid-cols-[70px_1.4fr_2.3fr_90px_170px]"
        >
          {list.map((item) => (
            <div
              className="grid grid-cols-1 gap-3 px-4 py-3 text-sm md:grid-cols-[70px_1.4fr_2.3fr_90px_170px] md:items-center"
              key={item._id}
            >
              {item.image ? (
                <img
                  className="h-12 w-12 rounded-full border border-border object-cover"
                  src={item.image}
                  alt={item.name || "Testimonial avatar"}
                  loading="lazy"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-soft font-semibold text-text-muted">
                  {item.name?.charAt(0) || "?"}
                </div>
              )}
              <div>
                <p className="font-medium text-text-main">{item.name}</p>
                <p className="text-xs text-text-muted">
                  {item.role || "Role not set"}
                  {item.company ? ` - ${item.company}` : ""}
                </p>
              </div>
              <p className="text-text-muted">{item.quote}</p>
              <p className="text-xs font-medium text-text-main">Rating: {item.rating}/5</p>
              <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
                <Link
                  to={`/testimonials/${item._id}/edit`}
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
        title="Delete testimonial?"
        description={`This will permanently remove "${pendingDelete?.name || "this testimonial"}".`}
        confirmLabel="Delete testimonial"
        busy={Boolean(pendingDelete && deletingId === pendingDelete._id)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove(pendingDelete._id)}
      />
    </>
  )
}

export default ListTestimonials
