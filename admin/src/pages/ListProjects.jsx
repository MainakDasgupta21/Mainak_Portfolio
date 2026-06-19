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

const ListProjects = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState("")
  const [pendingDelete, setPendingDelete] = useState(null)

  const fetchList = async () => {
    setLoading(true)
    try {
      const res = await axios.get(backendUrl + "/api/project/list")
      if (res.data.success) setList(res.data.projects || [])
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
        backendUrl + "/api/project/remove",
        { id },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        await fetchList()
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      toast.error(e.message)
    } finally {
      setDeletingId("")
      setPendingDelete(null)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <PageHeader
        title="Projects"
        description="Showcase portfolio projects with links, highlights, and visuals."
        actions={
          <Link
            to="/projects/add"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-brand bg-brand px-4 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Add project
          </Link>
        }
      />

      {loading ? <LoadingState label="Loading projects..." /> : null}

      {!loading && !list.length ? (
        <EmptyState title="No projects yet" message="Add your first project to populate the portfolio homepage." />
      ) : null}

      {!loading && list.length ? (
        <DataTableCard
          headers={["Preview", "Project", "Technologies", "Featured", "Actions"]}
          gridClass="grid-cols-[90px_1.5fr_2fr_110px_170px]"
        >
          {list.map((project) => (
            <div
              className="grid grid-cols-1 gap-3 px-4 py-3 text-sm md:grid-cols-[90px_1.5fr_2fr_110px_170px] md:items-center"
              key={project._id}
            >
              <img
                className="h-14 w-14 rounded-xl border border-border object-cover"
                src={(project.image && project.image[0]) || "https://placehold.co/56?text=+"}
                alt={project.name || "Project preview"}
                loading="lazy"
              />
              <div>
                <p className="font-medium text-text-main">{project.name}</p>
                <p className="mt-0.5 text-xs text-text-muted">{project.description || "No description"}</p>
              </div>
              <p className="text-xs text-text-muted">{(project.technologies || []).join(", ") || "Not specified"}</p>
              <span
                className={`inline-flex w-fit items-center rounded-full px-2 py-1 text-xs font-medium ${
                  project.featured
                    ? "bg-brand-soft text-brand"
                    : "bg-surface-soft text-text-muted"
                }`}
              >
                {project.featured ? "Featured" : "Standard"}
              </span>
              <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
                <Link
                  to={`/projects/${project._id}/edit`}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-surface px-3 text-sm font-medium text-text-main transition-colors hover:bg-surface-soft"
                >
                  Edit
                </Link>
                <Button
                  variant="danger-soft"
                  size="sm"
                  onClick={() => setPendingDelete(project)}
                  disabled={deletingId === project._id}
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
        title="Delete project?"
        description={`This will permanently remove "${pendingDelete?.name || "this project"}".`}
        confirmLabel="Delete project"
        busy={Boolean(pendingDelete && deletingId === pendingDelete._id)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove(pendingDelete._id)}
      />
    </>
  )
}

export default ListProjects
