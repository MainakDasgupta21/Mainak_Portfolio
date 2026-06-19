import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Link, useNavigate, useParams } from "react-router-dom"
import { backendUrl } from "../App"
import { assets } from "../assets/assets"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Field from "../components/ui/Field"
import Input from "../components/ui/Input"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"
import Textarea from "../components/ui/Textarea"

const initialState = {
  company: "",
  role: "",
  period: "",
  link: "",
  certificate: "",
  highlights: "",
  order: 0,
}

const AddExperience = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [form, setForm] = useState(initialState)
  const [logo, setLogo] = useState(null)
  const [existingLogo, setExistingLogo] = useState("")
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)

  const previewLogo = useMemo(() => (logo ? URL.createObjectURL(logo) : ""), [logo])

  useEffect(() => {
    return () => {
      if (previewLogo) URL.revokeObjectURL(previewLogo)
    }
  }, [previewLogo])

  useEffect(() => {
    if (!isEditMode) return

    const loadItem = async () => {
      setLoading(true)
      try {
        const res = await axios.get(backendUrl + "/api/experience/list")
        if (!res.data.success) {
          toast.error(res.data.message)
          navigate("/experience")
          return
        }
        const item = (res.data.experience || []).find((entry) => entry._id === id)
        if (!item) {
          toast.error("Experience entry not found")
          navigate("/experience")
          return
        }
        setForm({
          company: item.company || "",
          role: item.role || "",
          period: item.period || "",
          link: item.link || "",
          certificate: item.certificate || "",
          highlights: (item.highlights || []).join("\n"),
          order: item.order ?? 0,
        })
        setExistingLogo(item.logo || "")
      } catch (error) {
        toast.error(error.message)
        navigate("/experience")
      } finally {
        setLoading(false)
      }
    }

    loadItem()
  }, [id, isEditMode, navigate])

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      if (isEditMode) fd.append("id", id)
      fd.append("company", form.company)
      fd.append("role", form.role)
      fd.append("period", form.period)
      fd.append("link", form.link)
      fd.append("certificate", form.certificate)
      fd.append("highlights", JSON.stringify(form.highlights.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)))
      fd.append("order", form.order)
      if (logo) fd.append("logo", logo)

      const endpoint = isEditMode ? "/api/experience/update" : "/api/experience/add"
      const res = await axios.post(backendUrl + endpoint, fd, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message || (isEditMode ? "Experience updated" : "Experience added"))
        navigate("/experience")
      } else toast.error(res.data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading experience details..." />

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Experience" : "Add Experience"}
        description="Manage company details, links, and key highlights."
        actions={
          <Link
            to="/experience"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-text-main transition-colors hover:bg-surface-soft"
          >
            Back to experience
          </Link>
        }
      />

      <Card className="max-w-4xl p-5 sm:p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-text-main">Company logo</p>
            <label htmlFor="logo" className="cursor-pointer">
              <img
                className="h-20 w-20 rounded-xl border border-border object-cover"
                src={previewLogo || existingLogo || assets.upload_area}
                alt=""
              />
              <input
                id="logo"
                type="file"
                hidden
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Company" htmlFor="experience-company" required>
              <Input
                id="experience-company"
                value={form.company}
                onChange={(e) => setField("company", e.target.value)}
                required
              />
            </Field>
            <Field label="Role" htmlFor="experience-role" required>
              <Input
                id="experience-role"
                value={form.role}
                onChange={(e) => setField("role", e.target.value)}
                required
              />
            </Field>
            <Field label="Period" htmlFor="experience-period">
              <Input
                id="experience-period"
                value={form.period}
                onChange={(e) => setField("period", e.target.value)}
                placeholder="June 2025 - July 2025"
              />
            </Field>
            <Field label="Order" htmlFor="experience-order">
              <Input
                id="experience-order"
                type="number"
                value={form.order}
                onChange={(e) => setField("order", Number(e.target.value))}
              />
            </Field>
            <Field label="Company URL" htmlFor="experience-link">
              <Input
                id="experience-link"
                value={form.link}
                onChange={(e) => setField("link", e.target.value)}
              />
            </Field>
            <Field label="Certificate URL" htmlFor="experience-certificate">
              <Input
                id="experience-certificate"
                value={form.certificate}
                onChange={(e) => setField("certificate", e.target.value)}
              />
            </Field>
            <Field label="Highlights (one per line)" htmlFor="experience-highlights" className="sm:col-span-2">
              <Textarea
                id="experience-highlights"
                rows={5}
                value={form.highlights}
                onChange={(e) => setField("highlights", e.target.value)}
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEditMode ? "Save changes" : "Add experience"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/experience")} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}

export default AddExperience
