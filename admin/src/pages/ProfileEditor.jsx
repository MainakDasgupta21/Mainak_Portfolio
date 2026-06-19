import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const empty = {
  name: '', title: '', tagline: '', bio: '', email: '', phone: '',
  brandShortName: '', brandMonogram: '',
  heroUi: {
    badge: '', introPrefix: '', role: '',
    primaryCtaLabel: '', primaryCtaHref: '',
    secondaryCtaLabel: '', secondaryCtaHref: '',
    scrollHintTop: '', scrollHintBottom: '',
  },
  media: { heroVideoSrc: '', heroPosterSrc: '', heroProfileSrc: '', aboutProfileSrc: '', resumePdf: '' },
  links: { linkedin: '', github: '', leetcode: '', codeforces: '', geekforgeeks: '', twitter: '' },
  sectionSubtitles: { about: '', projects: '', experience: '', skills: '', achievements: '', testimonials: '', contact: '' },
  coursework: [],
}

// Hoisted out of the component so its identity is stable across renders.
// (Defining it inline inside the component body would create a new
// component type on every keystroke and remount the underlying <input>,
// losing focus and selection.)
const TextField = ({ label, value, onChange, type = 'text', placeholder }) => (
  <label className='flex flex-col gap-1 text-sm'>
    <span className='font-medium text-gray-700'>{label}</span>
    <input
      type={type}
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      className='px-3 py-2'
    />
  </label>
)

const Section = ({ title, children }) => (
  <div className='bg-white border rounded p-4 mb-5'>
    <h3 className='text-base font-semibold mb-3 text-gray-800'>{title}</h3>
    {children}
  </div>
)

const ProfileEditor = ({ token }) => {
  const [profile, setProfile] = useState(empty)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [courseworkText, setCourseworkText] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get(backendUrl + '/api/profile')
      if (res.data.success) {
        const p = { ...empty, ...res.data.profile }
        p.heroUi = { ...empty.heroUi, ...(p.heroUi || {}) }
        p.media = { ...empty.media, ...(p.media || {}) }
        p.links = { ...empty.links, ...(p.links || {}) }
        p.sectionSubtitles = { ...empty.sectionSubtitles, ...(p.sectionSubtitles || {}) }
        p.coursework = Array.isArray(p.coursework) ? p.coursework : []
        setProfile(p)
        setCourseworkText(p.coursework.join('\n'))
      }
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const set = (path, value) => {
    setProfile((prev) => {
      const next = structuredClone(prev)
      const keys = path.split('.')
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]]
      cur[keys[keys.length - 1]] = value
      return next
    })
  }

  // Read a deep value via "a.b.c" path, used by the field bindings below.
  const get = (path) => path.split('.').reduce((o, k) => (o ? o[k] : ''), profile) ?? ''
  const bind = (path, type, placeholder, label) => ({
    label,
    type,
    placeholder,
    value: get(path),
    onChange: (e) => set(path, e.target.value),
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...profile }
      payload.coursework = courseworkText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
      const res = await axios.post(backendUrl + '/api/profile/update', payload, { headers: { token } })
      if (res.data.success) {
        toast.success(res.data.message || 'Saved')
      } else {
        toast.error(res.data.message)
      }
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className='text-sm text-gray-500'>Loading profile…</p>

  return (
    <form onSubmit={onSubmit} className='max-w-5xl'>
      <h2 className='text-xl font-semibold mb-4'>Edit Profile (singleton)</h2>

      <Section title='Personal'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <TextField {...bind('name', 'text', 'MAINAK DASGUPTA', 'Name')} />
          <TextField {...bind('title', 'text', 'Software Developer', 'Title')} />
          <TextField {...bind('tagline', 'text', '', 'Tagline')} />
          <TextField {...bind('email', 'email', '', 'Email')} />
          <TextField {...bind('phone', 'text', '', 'Phone')} />
          <TextField {...bind('brandShortName', 'text', 'Mainak.', 'Brand short name')} />
          <TextField {...bind('brandMonogram', 'text', 'M', 'Brand monogram (1–2 chars)')} />
        </div>
        <label className='flex flex-col gap-1 text-sm mt-3'>
          <span className='font-medium text-gray-700'>Bio (paragraphs separated by a blank line)</span>
          <textarea
            value={profile.bio}
            onChange={(e) => set('bio', e.target.value)}
            className='px-3 py-2 min-h-[180px]'
          />
        </label>
      </Section>

      <Section title='Hero UI'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <TextField {...bind('heroUi.badge', 'text', '', 'Badge')} />
          <TextField {...bind('heroUi.introPrefix', 'text', '', 'Intro prefix')} />
          <TextField {...bind('heroUi.role', 'text', '', 'Role')} />
          <TextField {...bind('heroUi.primaryCtaLabel', 'text', '', 'Primary CTA label')} />
          <TextField {...bind('heroUi.primaryCtaHref', 'text', '', 'Primary CTA href')} />
          <TextField {...bind('heroUi.secondaryCtaLabel', 'text', '', 'Secondary CTA label')} />
          <TextField {...bind('heroUi.secondaryCtaHref', 'text', '', 'Secondary CTA href')} />
          <TextField {...bind('heroUi.scrollHintTop', 'text', '', 'Scroll hint (top)')} />
          <TextField {...bind('heroUi.scrollHintBottom', 'text', '', 'Scroll hint (bottom)')} />
        </div>
      </Section>

      <Section title='Media (paste Cloudinary URLs from the Media page, or local /asset.ext)'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <TextField {...bind('media.heroVideoSrc', 'text', '/back.mp4', 'Hero video')} />
          <TextField {...bind('media.heroPosterSrc', 'text', '/back-poster.jpg', 'Hero poster')} />
          <TextField {...bind('media.heroProfileSrc', 'text', '/me.png', 'Hero profile picture')} />
          <TextField {...bind('media.aboutProfileSrc', 'text', '/my-picture-informal-1.jpg', 'About profile picture')} />
          <TextField {...bind('media.resumePdf', 'text', '', 'Resume PDF')} />
        </div>
      </Section>

      <Section title='Social links'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <TextField {...bind('links.linkedin', 'text', '', 'LinkedIn')} />
          <TextField {...bind('links.github', 'text', '', 'GitHub')} />
          <TextField {...bind('links.leetcode', 'text', '', 'LeetCode')} />
          <TextField {...bind('links.codeforces', 'text', '', 'Codeforces')} />
          <TextField {...bind('links.geekforgeeks', 'text', '', 'GeeksForGeeks')} />
          <TextField {...bind('links.twitter', 'text', '', 'Twitter / X')} />
        </div>
      </Section>

      <Section title='Section subtitles'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <TextField {...bind('sectionSubtitles.about', 'text', '', 'About')} />
          <TextField {...bind('sectionSubtitles.projects', 'text', '', 'Projects')} />
          <TextField {...bind('sectionSubtitles.experience', 'text', '', 'Experience')} />
          <TextField {...bind('sectionSubtitles.skills', 'text', '', 'Skills')} />
          <TextField {...bind('sectionSubtitles.achievements', 'text', '', 'Achievements')} />
          <TextField {...bind('sectionSubtitles.testimonials', 'text', '', 'Testimonials')} />
          <TextField {...bind('sectionSubtitles.contact', 'text', '', 'Contact')} />
        </div>
      </Section>

      <Section title='Coursework (one per line)'>
        <textarea
          value={courseworkText}
          onChange={(e) => setCourseworkText(e.target.value)}
          className='px-3 py-2 w-full min-h-[150px]'
          placeholder={'Data Structure & Algorithms\nOperating System\n...'}
        />
      </Section>

      <button
        type='submit'
        disabled={saving}
        className='bg-black text-white px-6 py-2.5 rounded disabled:opacity-50'
      >
        {saving ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  )
}

export default ProfileEditor
