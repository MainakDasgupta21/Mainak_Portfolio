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
        description="Manage portfolio projects."
        actions={
          <Link
            to="/projects/add"
            className="inline-flex h-9 items-center justify-center rounded-md border border-brand bg-brand px-3.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
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
          headers={["Project", "Technologies", "Featured", "Actions"]}
          gridClass="grid-cols-[2fr_1.3fr_95px_130px]"
        >
          {list.map((project) => (
            <div
              className="grid grid-cols-1 gap-2 px-4 py-2.5 text-sm md:grid-cols-[2fr_1.3fr_95px_130px] md:items-center hover:bg-surface-soft/60"
              key={project._id}
            >
              <div className="flex items-center gap-2">
                <img
                  className="h-9 w-9 rounded-md border border-border object-cover"
                  src={(project.image && project.image[0]) || "https://placehold.co/40?text=+"}
                  alt={project.name || "Project preview"}
                  loading="lazy"
                />
                <div>
                  <p className="font-medium text-text-main">{project.name}</p>
                  <p className="text-xs text-text-muted">{project.github ? "GitHub linked" : "No repository link"}</p>
                </div>
              </div>
              <p className="text-xs text-text-muted truncate">{(project.technologies || []).join(", ") || "Not specified"}</p>
              <span
                className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 text-xs ${
                  project.featured
                    ? "bg-surface-soft text-text-main"
                    : "text-text-muted"
                }`}
              >
                {project.featured ? "Yes" : "No"}
              </span>
              <RowActions
                editTo={`/projects/${project._id}/edit`}
                onDelete={() => setPendingDelete(project)}
                busy={deletingId === project._id}
              />
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
