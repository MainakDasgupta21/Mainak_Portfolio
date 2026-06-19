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

const initialState = {
  degree: "",
  field: "",
  institution: "",
  year: "",
  grade: "",
  status: "Completed",
  order: 0,
}

const AddEducation = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEditMode) return

    const loadItem = async () => {
      setLoading(true)
      try {
        const res = await axios.get(backendUrl + "/api/education/list")
        if (!res.data.success) {
          toast.error(res.data.message)
          navigate("/education")
          return
        }
        const item = (res.data.education || []).find((entry) => entry._id === id)
        if (!item) {
          toast.error("Education entry not found")
          navigate("/education")
          return
        }
        setForm({
          degree: item.degree || "",
          field: item.field || "",
          institution: item.institution || "",
          year: item.year || "",
          grade: item.grade || "",
          status: item.status || "Completed",
          order: item.order ?? 0,
        })
      } catch (error) {
        toast.error(error.message)
        navigate("/education")
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
      const payload = {
        degree: form.degree,
        field: form.field,
        institution: form.institution,
        year: form.year,
        grade: form.grade,
        status: form.status,
        order: Number(form.order) || 0,
      }
      if (isEditMode) payload.id = id

      const endpoint = isEditMode ? "/api/education/update" : "/api/education/add"
      const res = await axios.post(backendUrl + endpoint, payload, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message || (isEditMode ? "Education updated" : "Education added"))
        navigate("/education")
      } else toast.error(res.data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading education details..." />

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Education" : "Add Education"}
        description="Education details."
        actions={
          <Link
            to="/education"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-surface px-3 text-sm font-medium text-text-main transition-colors hover:bg-surface-soft"
          >
            Back to education
          </Link>
        }
      />

      <Card className="max-w-2xl p-4 sm:p-5">
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Degree" htmlFor="education-degree" required>
              <Input
                id="education-degree"
                value={form.degree}
                onChange={(e) => setField("degree", e.target.value)}
                required
              />
            </Field>
            <Field label="Field" htmlFor="education-field">
              <Input
                id="education-field"
                value={form.field}
                onChange={(e) => setField("field", e.target.value)}
              />
            </Field>
            <Field label="Institution" htmlFor="education-institution" required>
              <Input
                id="education-institution"
                value={form.institution}
                onChange={(e) => setField("institution", e.target.value)}
                required
              />
            </Field>
            <Field label="Year" htmlFor="education-year">
              <Input
                id="education-year"
                value={form.year}
                onChange={(e) => setField("year", e.target.value)}
              />
            </Field>
            <Field label="Grade" htmlFor="education-grade">
              <Input
                id="education-grade"
                value={form.grade}
                onChange={(e) => setField("grade", e.target.value)}
              />
            </Field>
            <Field label="Status" htmlFor="education-status">
              <Select
                id="education-status"
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                <option value="Completed">Completed</option>
                <option value="Pursuing">Pursuing</option>
              </Select>
            </Field>
            <Field label="Order" htmlFor="education-order">
              <Input
                id="education-order"
                type="number"
                value={form.order}
                onChange={(e) => setField("order", e.target.value)}
              />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Saving..." : isEditMode ? "Save changes" : "Add education"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate("/education")} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}

export default AddEducation
