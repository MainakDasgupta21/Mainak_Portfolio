import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { backendUrl } from "../App"
import Card from "../components/ui/Card"
import ConfirmDialog from "../components/ui/ConfirmDialog"
import EmptyState from "../components/ui/EmptyState"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"
import RowActions from "../components/ui/RowActions"

const ListSkills = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState("")
  const [pendingDelete, setPendingDelete] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get(backendUrl + "/api/skill/list")
      if (res.data.success) setList(res.data.skills || [])
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
        backendUrl + "/api/skill/remove",
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

  const grouped = useMemo(() => {
    const map = {}
    list.forEach((skill) => {
      if (!map[skill.category]) map[skill.category] = []
      map[skill.category].push(skill)
    })
    return map
  }, [list])

  return (
    <>
      <PageHeader
        title="Skills"
        description="Manage grouped skills."
        actions={
          <Link
            to="/skills/add"
            className="inline-flex h-9 items-center justify-center rounded-md border border-brand bg-brand px-3.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Add skill
          </Link>
        }
      />

      {loading ? <LoadingState label="Loading skills..." /> : null}

      {!loading && Object.keys(grouped).length === 0 ? (
        <EmptyState title="No skills yet" message="Create skills to build grouped expertise cards on the public portfolio." />
      ) : null}

      {!loading
        ? Object.entries(grouped).map(([category, items]) => (
            <Card key={category} className="mb-4">
              <div className="border-b border-border/70 px-4 py-2">
                <h2 className="text-sm font-medium text-text-main">{category}</h2>
              </div>
              <div className="divide-y divide-border">
                {items.map((skill) => (
                  <div
                    key={skill._id}
                    className="grid grid-cols-1 items-center gap-2 px-4 py-2.5 text-sm md:grid-cols-[2fr_120px_130px] hover:bg-surface-soft/60"
                  >
                    <div>
                      <p className="font-medium text-text-main">{skill.name}</p>
                      <p className="text-xs text-text-muted">Order {skill.order ?? 0}</p>
                    </div>
                    <p className="text-xs text-text-muted">{skill.proficiency}%</p>
                    <RowActions
                      editTo={`/skills/${skill._id}/edit`}
                      onDelete={() => setPendingDelete(skill)}
                      busy={deletingId === skill._id}
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))
        : null}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete skill?"
        description={`This will permanently remove "${pendingDelete?.name || "this skill"}".`}
        confirmLabel="Delete skill"
        busy={Boolean(pendingDelete && deletingId === pendingDelete._id)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove(pendingDelete._id)}
      />
    </>
  )
}

export default ListSkills
