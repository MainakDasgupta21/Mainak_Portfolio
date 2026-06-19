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
  name: "",
  role: "",
  company: "",
  quote: "",
  rating: 5,
  order: 0,
}

const AddTestimonial = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [form, setForm] = useState(initialState)
  const [image, setImage] = useState(null)
  const [existingImage, setExistingImage] = useState("")
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)

  const previewImage = useMemo(() => (image ? URL.createObjectURL(image) : ""), [image])

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage)
    }
  }, [previewImage])

  useEffect(() => {
    if (!isEditMode) return

    const loadItem = async () => {
      setLoading(true)
      try {
        const res = await axios.get(backendUrl + "/api/testimonial/list")
        if (!res.data.success) {
          toast.error(res.data.message)
          navigate("/testimonials")
          return
        }
        const item = (res.data.testimonials || []).find((entry) => entry._id === id)
        if (!item) {
          toast.error("Testimonial not found")
          navigate("/testimonials")
          return
        }
        setForm({
          name: item.name || "",
          role: item.role || "",
          company: item.company || "",
          quote: item.quote || "",
          rating: item.rating ?? 5,
          order: item.order ?? 0,
        })
        setExistingImage(item.image || "")
      } catch (error) {
        toast.error(error.message)
        navigate("/testimonials")
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
      fd.append("name", form.name)
      fd.append("role", form.role)
      fd.append("company", form.company)
      fd.append("quote", form.quote)
      fd.append("rating", form.rating)
      fd.append("order", form.order)
      if (image) fd.append("image", image)

      const endpoint = isEditMode ? "/api/testimonial/update" : "/api/testimonial/add"
      const res = await axios.post(backendUrl + endpoint, fd, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message || (isEditMode ? "Testimonial updated" : "Testimonial added"))
        navigate("/testimonials")
      } else toast.error(res.data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading testimonial details..." />

  return (
    <>
      <PageHeader
        title={isEditMode ? "Edit Testimonial" : "Add Testimonial"}
        description="Manage social proof entries with optional profile photos."
        actions={
          <Link
            to="/testimonials"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-medium text-text-main transition-colors hover:bg-surface-soft"
          >
            Back to testimonials
          </Link>
        }
      />

      <Card className="max-w-3xl p-5 sm:p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-text-main">Photo (optional)</p>
            <label htmlFor="testimonial-image" className="cursor-pointer">
              <img
                className="h-20 w-20 rounded-xl border border-border object-cover"
                src={previewImage || existingImage || assets.upload_area}
                alt=""
              />
              <input
                id="testimonial-image"
                type="file"
                hidden
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="testimonial-name" required>
              <Input
                id="testimonial-name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                required
              />
            </Field>
            <Field label="Role" htmlFor="testimonial-role">
              <Input
                id="testimonial-role"
                value={form.role}
                onChange={(e) => setField("role", e.target.value)}
              />
            </Field>
            <Field label="Company" htmlFor="testimonial-company">
              <Input
                id="testimonial-company"
                value={form.company}
                onChange={(e) => setField("company", e.target.value)}
              />
            </Field>
            <Field label="Rating (1-5)" htmlFor="testimonial-rating">
              <Input
                id="testimonial-rating"
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={(e) => setField("rating", e.target.value)}
              />
            </Field>
            <Field label="Order" htmlFor="testimonial-order">
              <Input
                id="testimonial-order"
                type="number"
                value={form.order}
                onChange={(e) => setField("order", e.target.value)}
              />
            </Field>
            <Field label="Quote" htmlFor="testimonial-quote" required className="sm:col-span-2">
              <Textarea
                id="testimonial-quote"
                rows={5}
                value={form.quote}
                onChange={(e) => setField("quote", e.target.value)}
                required
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEditMode ? "Save changes" : "Add testimonial"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/testimonials")} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </>
  )
}

export default AddTestimonial
