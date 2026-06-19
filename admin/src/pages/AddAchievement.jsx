import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Link, useNavigate, useParams } from "react-router-dom"
import { backendUrl } from "../App"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Field from "../components/ui/Field"
import Input from "../components/ui/Input"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"
import Select from "../components/ui/Select"
import Textarea from "../components/ui/Textarea"

const ICONS = ["trophy", "award", "medal"]

const initialState = {
  title: "",
  description: "",
  icon: "trophy",
  order: 0,
}

const AddAchievement = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEditMode) return

    const loadAchievement = async () => {
      setLoading(true)
      try {
        const res = await axios.get(backendUrl + "/api/achievement/list")
        if (!res.data.success) {
          toast.error(res.data.message)
          navigate("/achievements")
          return
        }
        const item = (res.data.achievements || []).find((entry) => entry._id === id)
        if (!item) {
          toast.error("Achievement not found")
          navigate("/achievements")
          return
        }
        setForm({
          title: item.title || "",
          description: item.description || "",
          icon: item.icon || "trophy",
          order: item.order ?? 0,
        })
      } catch (error) {
        toast.error(error.message)
        navigate("/achievements")
      } finally {
        setLoading(false)
      }
    }

    loadAchievement()
  }, [id, isEditMode, navigate])

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        icon: form.icon,
        order: Number(form.order) || 0,
      }
      if (isEditMode) payload.id = id
      const endpoint = isEditMode ? "/api/achievement/update" : "/api/achievement/add"
      const res = await axios.post(backendUrl + endpoint, payload, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message || (isEditMode ? "Achievement updated" : "Achievement added"))
        navigate("/achievements")
      } else toast.error(res.data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading achievement details..." />

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Achievement" : "Add Achievement"}
        description="Capture awards and recognitions with icon metadata."
        actions={
          <Link
            to="/achievements"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-text-main transition-colors hover:bg-surface-soft"
          >
            Back to achievements
          </Link>
        }
      />

      <Card className="max-w-xl p-5 sm:p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Title" htmlFor="achievement-title" required>
            <Input
              id="achievement-title"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              required
            />
          </Field>

          <Field label="Description" htmlFor="achievement-description">
            <Textarea
              id="achievement-description"
              rows={4}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Icon" htmlFor="achievement-icon">
              <Select
                id="achievement-icon"
                value={form.icon}
                onChange={(e) => setField("icon", e.target.value)}
              >
                {ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Order" htmlFor="achievement-order">
              <Input
                id="achievement-order"
                type="number"
                value={form.order}
                onChange={(e) => setField("order", e.target.value)}
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEditMode ? "Save changes" : "Add achievement"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/achievements")} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}

export default AddAchievement
