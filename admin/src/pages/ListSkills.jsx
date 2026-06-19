import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { backendUrl } from "../App"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import ConfirmDialog from "../components/ui/ConfirmDialog"
import EmptyState from "../components/ui/EmptyState"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"

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
        description="Maintain grouped skills with proficiency and ordering."
        actions={
          <Link
            to="/skills/add"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-brand bg-brand px-4 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
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
              <div className="border-b border-border bg-surface-soft px-4 py-2.5">
                <h2 className="text-sm font-semibold text-text-main">{category}</h2>
              </div>
              <div className="divide-y divide-border">
                {items.map((skill) => (
                  <div
                    key={skill._id}
                    className="grid grid-cols-1 items-center gap-3 px-4 py-3 text-sm md:grid-cols-[2fr_130px_170px]"
                  >
                    <div>
                      <p className="font-medium text-text-main">{skill.name}</p>
                      <p className="text-xs text-text-muted">Order: {skill.order ?? 0}</p>
                    </div>
                    <div className="text-xs text-text-muted">
                      <div className="mb-1 flex items-center justify-between">
                        <span>Proficiency</span>
                        <span className="font-medium text-text-main">{skill.proficiency}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-soft">
                        <div
                          className="h-2 rounded-full bg-brand"
                          style={{ width: `${Math.min(100, Math.max(0, Number(skill.proficiency) || 0))}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
                      <Link
                        to={`/skills/${skill._id}/edit`}
                        className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-surface px-3 text-sm font-medium text-text-main transition-colors hover:bg-surface-soft"
                      >
                        Edit
                      </Link>
                      <Button
                        variant="danger-soft"
                        size="sm"
                        onClick={() => setPendingDelete(skill)}
                        disabled={deletingId === skill._id}
                      >
                        Delete
                      </Button>
                    </div>
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
