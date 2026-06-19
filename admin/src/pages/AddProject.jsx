import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Link, useNavigate, useParams } from "react-router-dom"
import { backendUrl } from "../App"
import { assets } from "../assets/assets"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Checkbox from "../components/ui/Checkbox"
import Field from "../components/ui/Field"
import FilePicker from "../components/ui/FilePicker"
import Input from "../components/ui/Input"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"
import Textarea from "../components/ui/Textarea"

const initialState = {
  name: "",
  description: "",
  technologies: "",
  highlights: "",
  github: "",
  demo: "",
  featured: true,
  order: 0,
}

const AddProject = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null })
  const [existingImages, setExistingImages] = useState([])

  useEffect(() => {
    if (!isEditMode) return

    const loadProject = async () => {
      setLoading(true)
      try {
        const res = await axios.get(backendUrl + "/api/project/list")
        if (!res.data.success) {
          toast.error(res.data.message)
          navigate("/projects")
          return
        }
        const project = (res.data.projects || []).find((item) => item._id === id)
        if (!project) {
          toast.error("Project not found")
          navigate("/projects")
          return
        }
        setForm({
          name: project.name || "",
          description: project.description || "",
          technologies: (project.technologies || []).join(", "),
          highlights: (project.highlights || []).join("\n"),
          github: project.github || "",
          demo: project.demo || "",
          featured: Boolean(project.featured),
          order: project.order ?? 0,
        })
        setExistingImages(project.image || [])
      } catch (error) {
        toast.error(error.message)
        navigate("/projects")
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [id, isEditMode, navigate])

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const setImage = (field, file) => {
    setImages((prev) => ({ ...prev, [field]: file }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      if (isEditMode) fd.append("id", id)
      fd.append("name", form.name)
      fd.append("description", form.description)
      fd.append("technologies", JSON.stringify(form.technologies.split(",").map((s) => s.trim()).filter(Boolean)))
      fd.append("highlights", JSON.stringify(form.highlights.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)))
      fd.append("github", form.github)
      fd.append("demo", form.demo)
      fd.append("featured", form.featured)
      fd.append("order", form.order)
      if (images.image1) fd.append("image1", images.image1)
      if (images.image2) fd.append("image2", images.image2)
      if (images.image3) fd.append("image3", images.image3)
      if (images.image4) fd.append("image4", images.image4)

      const endpoint = isEditMode ? "/api/project/update" : "/api/project/add"
      const res = await axios.post(backendUrl + endpoint, fd, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message || (isEditMode ? "Project updated" : "Project added"))
        navigate("/projects")
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading project details..." />

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Project" : "Add Project"}
        description="Project details and links."
        actions={
          <Link
            to="/projects"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-surface px-3 text-sm font-medium text-text-main transition-colors hover:bg-surface-soft"
          >
            Back to projects
          </Link>
        }
      />

      <Card className="max-w-3xl p-4 sm:p-5">
        <form onSubmit={onSubmit} className="space-y-3">
          <Field label="Project images (up to 4)">
            <div className="flex flex-wrap gap-2">
              {["image1", "image2", "image3", "image4"].map((field, index) => (
                <FilePicker
                  key={field}
                  id={field}
                  file={images[field]}
                  onChange={(file) => setImage(field, file)}
                  currentUrl={existingImages[index] || ""}
                  fallbackSrc={assets.upload_area}
                  accept="image/*"
                />
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Name" htmlFor="project-name" required className="sm:col-span-2">
              <Input
                id="project-name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                required
              />
            </Field>

            <Field label="Description" htmlFor="project-description" required className="sm:col-span-2">
              <Textarea
                id="project-description"
                rows={4}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                required
              />
            </Field>

            <Field label="Technologies (comma-separated)" htmlFor="project-technologies" className="sm:col-span-2">
              <Input
                id="project-technologies"
                value={form.technologies}
                onChange={(e) => setField("technologies", e.target.value)}
                placeholder="React, Node.js, MongoDB"
              />
            </Field>

            <Field label="Highlights (one per line)" htmlFor="project-highlights" className="sm:col-span-2">
              <Textarea
                id="project-highlights"
                rows={5}
                value={form.highlights}
                onChange={(e) => setField("highlights", e.target.value)}
              />
            </Field>

            <Field label="GitHub URL" htmlFor="project-github">
              <Input
                id="project-github"
                value={form.github}
                onChange={(e) => setField("github", e.target.value)}
              />
            </Field>
            <Field label="Demo URL" htmlFor="project-demo">
              <Input
                id="project-demo"
                value={form.demo}
                onChange={(e) => setField("demo", e.target.value)}
              />
            </Field>

            <Field label="Order" htmlFor="project-order">
              <Input
                id="project-order"
                type="number"
                value={form.order}
                onChange={(e) => setField("order", Number(e.target.value))}
              />
            </Field>
            <label className="flex items-center gap-2 self-end text-sm text-text-main">
              <Checkbox
                checked={form.featured}
                onChange={(e) => setField("featured", e.target.checked)}
              />
              Featured project
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Saving..." : isEditMode ? "Save changes" : "Add project"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigate("/projects")}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}

export default AddProject
