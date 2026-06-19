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

const CATEGORIES = [
  "Programming Languages",
  "Version Control",
  "Databases",
  "Technologies & Tools",
  "Web Development",
  "ML & AI",
  "Frontend Development",
  "Backend Development",
  "Frameworks & Libraries",
  "Mobile Development",
  "DevOps & CI/CD",
  "Cloud & Infrastructure",
  "Containers & Orchestration",
  "Operating Systems",
  "Testing & QA",
  "Data Engineering",
  "Data Science & Analytics",
  "Big Data",
  "Deep Learning",
  "Generative AI & LLMs",
  "Computer Vision",
  "NLP",
  "Cybersecurity",
  "Networking",
  "System Design & Architecture",
  "API & Integration",
  "Message Queues & Streaming",
  "Caching",
  "Monitoring & Observability",
  "Infrastructure as Code",
  "Scripting & Automation",
  "Tools & IDEs",
  "UI/UX & Design",
  "Game Development",
  "Embedded & IoT",
  "Blockchain & Web3",
  "AR/VR",
  "Project Management & Methodologies",
  "Soft Skills",
]

const initialState = {
  category: CATEGORIES[0],
  name: "",
  proficiency: 85,
  order: 0,
}

const AddSkill = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEditMode) return

    const loadSkill = async () => {
      setLoading(true)
      try {
        const res = await axios.get(backendUrl + "/api/skill/list")
        if (!res.data.success) {
          toast.error(res.data.message)
          navigate("/skills")
          return
        }
        const skill = (res.data.skills || []).find((item) => item._id === id)
        if (!skill) {
          toast.error("Skill not found")
          navigate("/skills")
          return
        }
        setForm({
          category: skill.category || CATEGORIES[0],
          name: skill.name || "",
          proficiency: skill.proficiency ?? 0,
          order: skill.order ?? 0,
        })
      } catch (error) {
        toast.error(error.message)
        navigate("/skills")
      } finally {
        setLoading(false)
      }
    }

    loadSkill()
  }, [id, isEditMode, navigate])

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        category: form.category,
        name: form.name,
        proficiency: Number(form.proficiency) || 0,
        order: Number(form.order) || 0,
      }
      if (isEditMode) payload.id = id

      const endpoint = isEditMode ? "/api/skill/update" : "/api/skill/add"
      const res = await axios.post(backendUrl + endpoint, payload, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message || (isEditMode ? "Skill updated" : "Skill added"))
        navigate("/skills")
      } else toast.error(res.data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading skill details..." />

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Skill" : "Add Skill"}
        description="Skill category, proficiency, and order."
        actions={
          <Link
            to="/skills"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-surface px-3 text-sm font-medium text-text-main transition-colors hover:bg-surface-soft"
          >
            Back to skills
          </Link>
        }
      />

      <Card className="max-w-xl p-4 sm:p-5">
        <form onSubmit={onSubmit} className="space-y-3">
          <Field label="Category" htmlFor="skill-category" required>
            <Input
              id="skill-category"
              list="skill-categories"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              placeholder="Select or type a category"
              required
            />
            <datalist id="skill-categories">
              {CATEGORIES.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </Field>

          <Field label="Name" htmlFor="skill-name" required>
            <Input
              id="skill-name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
            />
          </Field>

          <Field label="Proficiency (0-100)" htmlFor="skill-proficiency" required>
            <Input
              id="skill-proficiency"
              type="number"
              min="0"
              max="100"
              value={form.proficiency}
              onChange={(e) => setField("proficiency", e.target.value)}
              required
            />
          </Field>

          <Field label="Order" htmlFor="skill-order">
            <Input
              id="skill-order"
              type="number"
              value={form.order}
              onChange={(e) => setField("order", e.target.value)}
            />
          </Field>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Saving..." : isEditMode ? "Save changes" : "Add skill"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/skills")} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}

export default AddSkill
