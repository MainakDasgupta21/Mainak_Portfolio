import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { backendUrl } from "../App"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Field from "../components/ui/Field"
import Input from "../components/ui/Input"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"
import Textarea from "../components/ui/Textarea"

const empty = {
  name: "",
  title: "",
  tagline: "",
  bio: "",
  email: "",
  phone: "",
  brandShortName: "",
  brandMonogram: "",
  heroUi: {
    badge: "",
    introPrefix: "",
    role: "",
    primaryCtaLabel: "",
    primaryCtaHref: "",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
    scrollHintTop: "",
    scrollHintBottom: "",
  },
  media: {
    heroVideoSrc: "",
    heroPosterSrc: "",
    heroProfileSrc: "",
    aboutProfileSrc: "",
    resumePdf: "",
  },
  links: {
    linkedin: "",
    github: "",
    leetcode: "",
    codeforces: "",
    geekforgeeks: "",
    twitter: "",
  },
  sectionSubtitles: {
    about: "",
    projects: "",
    experience: "",
    skills: "",
    achievements: "",
    contact: "",
  },
  coursework: [],
}

const Section = ({ title, description, children }) => (
  <Card className="mb-3 p-4 sm:p-5">
    <h2 className="text-sm font-medium text-text-main">{title}</h2>
    {description ? <p className="mt-0.5 text-xs text-text-muted">{description}</p> : null}
    <div className="mt-3">{children}</div>
  </Card>
)

const TextField = ({ label, value, onChange, type = "text", placeholder = "", required = false }) => (
  <Field label={label} required={required}>
    <Input
      type={type}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  </Field>
)

const updatePath = (source, path, value) => {
  const keys = path.split(".")
  const next = { ...source }
  let cursorNew = next
  let cursorOld = source
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    cursorNew[key] = { ...(cursorOld?.[key] || {}) }
    cursorNew = cursorNew[key]
    cursorOld = cursorOld?.[key] || {}
  }
  cursorNew[keys[keys.length - 1]] = value
  return next
}

const ProfileEditor = ({ token }) => {
  const [profile, setProfile] = useState(empty)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [courseworkText, setCourseworkText] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get(backendUrl + "/api/profile")
      if (res.data.success) {
        const p = { ...empty, ...res.data.profile }
        p.heroUi = { ...empty.heroUi, ...(p.heroUi || {}) }
        p.media = { ...empty.media, ...(p.media || {}) }
        p.links = { ...empty.links, ...(p.links || {}) }
        p.sectionSubtitles = { ...empty.sectionSubtitles, ...(p.sectionSubtitles || {}) }
        p.coursework = Array.isArray(p.coursework) ? p.coursework : []
        setProfile(p)
        setCourseworkText(p.coursework.join("\n"))
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const set = (path, value) => {
    setProfile((prev) => updatePath(prev, path, value))
  }

  const get = (path) => path.split(".").reduce((obj, key) => (obj ? obj[key] : ""), profile) ?? ""

  const bind = (path, type, placeholder, label, required = false) => ({
    label,
    type,
    placeholder,
    required,
    value: get(path),
    onChange: (e) => set(path, e.target.value),
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...profile,
        coursework: courseworkText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
      }
      const res = await axios.post(backendUrl + "/api/profile/update", payload, { headers: { token } })
      if (res.data.success) toast.success(res.data.message || "Profile saved")
      else toast.error(res.data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Loading profile..." />

  return (
    <>
      <PageHeader
        title="Profile Settings"
        description="Manage global profile content."
        actions={
          <Link
            to="/media"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-surface px-3 text-sm font-medium text-text-main transition-colors hover:bg-surface-soft"
          >
            Open media library
          </Link>
        }
      />

      <form onSubmit={onSubmit} className="max-w-5xl">
        <Section title="Personal" description="Core identity information shown across sections.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField {...bind("name", "text", "MAINAK DASGUPTA", "Name", true)} />
            <TextField {...bind("title", "text", "Software Developer", "Title", true)} />
            <TextField {...bind("tagline", "text", "", "Tagline")} />
            <TextField {...bind("email", "email", "", "Email")} />
            <TextField {...bind("phone", "text", "", "Phone")} />
            <TextField {...bind("brandShortName", "text", "Mainak.", "Brand short name")} />
            <TextField {...bind("brandMonogram", "text", "M", "Brand monogram")} />
            <Field label="Bio (paragraphs separated by blank lines)" className="sm:col-span-2">
              <Textarea
                rows={8}
                value={profile.bio}
                onChange={(e) => set("bio", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Hero UI" description="Headline, badge, and call-to-action text for the homepage hero section.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField {...bind("heroUi.badge", "text", "", "Badge")} />
            <TextField {...bind("heroUi.introPrefix", "text", "", "Intro prefix")} />
            <TextField {...bind("heroUi.role", "text", "", "Role (Home second line)")} />
            <TextField {...bind("heroUi.primaryCtaLabel", "text", "", "Primary CTA label")} />
            <TextField {...bind("heroUi.primaryCtaHref", "text", "", "Primary CTA href")} />
            <TextField {...bind("heroUi.secondaryCtaLabel", "text", "", "Secondary CTA label")} />
            <TextField {...bind("heroUi.secondaryCtaHref", "text", "", "Secondary CTA href")} />
            <TextField {...bind("heroUi.scrollHintTop", "text", "", "Scroll hint top")} />
            <TextField {...bind("heroUi.scrollHintBottom", "text", "", "Scroll hint bottom")} />
          </div>
        </Section>

        <Section title="Media" description="Paste Cloudinary URLs from Media Library or local public paths.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField {...bind("media.heroVideoSrc", "text", "/back.mp4", "Hero video")} />
            <TextField {...bind("media.heroPosterSrc", "text", "/back-poster.jpg", "Hero poster")} />
            <TextField {...bind("media.heroProfileSrc", "text", "/me.png", "Hero profile image")} />
            <TextField {...bind("media.aboutProfileSrc", "text", "/my-picture-informal-1.jpg", "About profile image")} />
            <TextField {...bind("media.resumePdf", "text", "", "Resume PDF URL")} />
          </div>
        </Section>

        <Section title="Social links" description="Public profile links rendered in footer and contact areas.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField {...bind("links.linkedin", "text", "", "LinkedIn")} />
            <TextField {...bind("links.github", "text", "", "GitHub")} />
            <TextField {...bind("links.leetcode", "text", "", "LeetCode")} />
            <TextField {...bind("links.codeforces", "text", "", "Codeforces")} />
            <TextField {...bind("links.geekforgeeks", "text", "", "GeeksForGeeks")} />
            <TextField {...bind("links.twitter", "text", "", "Twitter / X")} />
          </div>
        </Section>

        <Section title="Section subtitles" description="Subheading copy used in each public portfolio section.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField {...bind("sectionSubtitles.about", "text", "", "About")} />
            <TextField {...bind("sectionSubtitles.projects", "text", "", "Projects")} />
            <TextField {...bind("sectionSubtitles.experience", "text", "", "Experience")} />
            <TextField {...bind("sectionSubtitles.skills", "text", "", "Skills")} />
            <TextField {...bind("sectionSubtitles.achievements", "text", "", "Achievements")} />
            <TextField {...bind("sectionSubtitles.contact", "text", "", "Contact")} />
          </div>
        </Section>

        <Section title="Coursework" description="Add one coursework entry per line.">
          <Field label="Coursework list" htmlFor="coursework-textarea">
            <Textarea
              id="coursework-textarea"
              rows={7}
              value={courseworkText}
              onChange={(e) => setCourseworkText(e.target.value)}
              placeholder={"Data Structure & Algorithms\nOperating System"}
            />
          </Field>
        </Section>

        <div className="mb-6 flex items-center gap-2">
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={load} disabled={saving}>
            Reset from server
          </Button>
        </div>
      </form>
    </>
  )
}

export default ProfileEditor
