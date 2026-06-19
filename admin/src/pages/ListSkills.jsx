import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { backendUrl } from "../App"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import ConfirmDialog from "../components/ui/ConfirmDialog"
import EmptyState from "../components/ui/EmptyState"
import Input from "../components/ui/Input"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"
import RowActions from "../components/ui/RowActions"

const ListSkills = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState("")
  const [pendingDelete, setPendingDelete] = useState(null)
  const [quickAddOpen, setQuickAddOpen] = useState({})
  const [quickAddNames, setQuickAddNames] = useState({})
  const [quickAddProficiencies, setQuickAddProficiencies] = useState({})
  const [addingCategory, setAddingCategory] = useState("")

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

  const addQuickSkill = async (category) => {
    if (addingCategory) return

    const name = (quickAddNames[category] || "").trim()
    if (!name) {
      toast.error("Skill name is required")
      return
    }
    const proficiency = Number(quickAddProficiencies[category] ?? 80)
    if (!Number.isFinite(proficiency) || proficiency < 0 || proficiency > 100) {
      toast.error("Proficiency must be between 0 and 100")
      return
    }

    const items = grouped[category] || []
    const maxOrder = items.reduce((max, skill) => {
      const order = Number(skill.order)
      return Number.isFinite(order) ? Math.max(max, order) : max
    }, -1)
    const nextOrder = maxOrder + 1

    setAddingCategory(category)
    try {
      const res = await axios.post(
        backendUrl + "/api/skill/add",
        { category, name, proficiency, order: nextOrder },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success(res.data.message || "Skill Added")
        setQuickAddNames((prev) => ({ ...prev, [category]: "" }))
        setQuickAddProficiencies((prev) => ({ ...prev, [category]: "80" }))
        setQuickAddOpen((prev) => ({ ...prev, [category]: false }))
        await load()
      } else toast.error(res.data.message)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setAddingCategory("")
    }
  }

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
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-medium text-text-main">{category}</h2>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 px-2.5 text-xs"
                    onClick={() => {
                      setQuickAddOpen((prev) => ({ ...prev, [category]: !prev[category] }))
                      setQuickAddProficiencies((prev) => ({
                        ...prev,
                        [category]: prev[category] ?? "80",
                      }))
                    }}
                    disabled={addingCategory === category}
                  >
                    Add
                  </Button>
                </div>
              </div>
              {quickAddOpen[category] ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    addQuickSkill(category)
                  }}
                  className="border-b border-border/70 px-4 py-2.5"
                >
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_120px_auto] sm:items-center">
                    <Input
                      id={`quick-skill-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      value={quickAddNames[category] || ""}
                      onChange={(e) =>
                        setQuickAddNames((prev) => ({
                          ...prev,
                          [category]: e.target.value,
                        }))
                      }
                      placeholder={`Add skill to ${category}`}
                      className="h-8"
                      disabled={addingCategory === category}
                    />
                    <Input
                      id={`quick-skill-proficiency-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      type="number"
                      min="0"
                      max="100"
                      value={quickAddProficiencies[category] ?? "80"}
                      onChange={(e) =>
                        setQuickAddProficiencies((prev) => ({
                          ...prev,
                          [category]: e.target.value,
                        }))
                      }
                      placeholder="80"
                      className="h-8"
                      disabled={addingCategory === category}
                    />
                    <div className="flex items-center gap-2">
                      <Button type="submit" size="sm" className="h-8 px-3" disabled={addingCategory === category}>
                        {addingCategory === category ? "Adding..." : "Add"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => setQuickAddOpen((prev) => ({ ...prev, [category]: false }))}
                        disabled={addingCategory === category}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              ) : null}
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
