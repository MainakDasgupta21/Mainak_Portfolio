/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const PortfolioContext = createContext({})

// Keep skeletons on screen for at least this long once a real fetch starts, so a
// fast/cached response can't cause a sub-second flicker as cards swap in.
const MIN_SKELETON_MS = 420

const DEFAULTS = {
  profile: {
    // Mirrors the backend profile shape (name + title) so the hero renders
    // pixel-identical on first paint and never flashes a different name.
    name: "Mainak",
    title: "Dasgupta",
    tagline: "Building scalable systems and intelligent solutions",
    bio: "",
    email: "",
    phone: "",
    brandShortName: "",
    brandMonogram: "",
    heroUi: {
      badge: "Crafting Unique Solutions",
      introPrefix: "Hi, I'm",
      role: "Software Developer",
      primaryCtaLabel: "Book a Free Call",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "See Projects",
      secondaryCtaHref: "#projects",
      scrollHintTop: "Scroll down",
      scrollHintBottom: "to see projects",
    },
    media: {
      heroVideoSrc: "/back.mp4",
      heroPosterSrc: "/back-poster.jpg",
      heroProfileSrc: "/me.png",
      aboutProfileSrc: "/my-picture-informal-1.jpg",
      resumePdf: "",
    },
    links: {},
    sectionSubtitles: {
      about: "",
      projects: "Transforming ideas into elegant solutions",
      experience: "Professional journey building impactful solutions",
      skills: "Technical expertise across multiple domains",
      achievements: "Recognition and milestones that define excellence",
      contact: "Let's discuss your next project",
    },
    coursework: [],
  },
  projects: [],
  experience: [],
  skills: [],
  achievements: [],
  education: [],
}

const PortfolioContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || ""

  const [profile, setProfile] = useState(DEFAULTS.profile)
  const [projects, setProjects] = useState(DEFAULTS.projects)
  const [experience, setExperience] = useState(DEFAULTS.experience)
  const [skills, setSkills] = useState(DEFAULTS.skills)
  const [achievements, setAchievements] = useState(DEFAULTS.achievements)
  const [education, setEducation] = useState(DEFAULTS.education)
  // `loading` tracks the initial content hydration window. When there's no
  // backend we render defaults immediately, so we start `false` to avoid a
  // one-frame skeleton flash before the effect runs.
  const [loading, setLoading] = useState(() => Boolean(backendUrl))
  const [error, setError] = useState(false)
  // Bumping this key re-runs the fetch effect (used by the retry button).
  const [reloadToken, setReloadToken] = useState(0)
  const minTimerRef = useRef(null)

  const retry = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    if (minTimerRef.current) {
      clearTimeout(minTimerRef.current)
      minTimerRef.current = null
    }

    if (!backendUrl) {
      setLoading(false)
      setError(false)
      return
    }

    setLoading(true)
    setError(false)
    const startedAt = Date.now()

    // Delay flipping `loading` off until skeletons have shown for a graceful
    // minimum, preventing a flash on fast/cached responses.
    const finishLoading = () => {
      if (cancelled) return
      const remaining = MIN_SKELETON_MS - (Date.now() - startedAt)
      if (remaining > 0) {
        minTimerRef.current = setTimeout(() => {
          if (!cancelled) setLoading(false)
        }, remaining)
      } else {
        setLoading(false)
      }
    }

    async function load() {
      try {
        const [
          profileRes,
          projectsRes,
          experienceRes,
          skillsRes,
          achievementsRes,
          educationRes,
        ] = await Promise.all([
          axios.get(backendUrl + "/api/profile"),
          axios.get(backendUrl + "/api/project/list"),
          axios.get(backendUrl + "/api/experience/list"),
          axios.get(backendUrl + "/api/skill/list"),
          axios.get(backendUrl + "/api/achievement/list"),
          axios.get(backendUrl + "/api/education/list"),
        ])

        if (cancelled) return

        if (profileRes.data?.success && profileRes.data.profile) {
          // Merge with defaults so missing nested keys never crash a section.
          const fetched = profileRes.data.profile
          const merged = {
            ...DEFAULTS.profile,
            ...fetched,
            heroUi: { ...DEFAULTS.profile.heroUi, ...(fetched.heroUi || {}) },
            media: { ...DEFAULTS.profile.media, ...(fetched.media || {}) },
            links: { ...DEFAULTS.profile.links, ...(fetched.links || {}) },
            sectionSubtitles: {
              ...DEFAULTS.profile.sectionSubtitles,
              ...(fetched.sectionSubtitles || {}),
            },
          }
          setProfile(merged)
        }
        if (projectsRes.data?.success) setProjects(projectsRes.data.projects || [])
        if (experienceRes.data?.success) setExperience(experienceRes.data.experience || [])
        if (skillsRes.data?.success) setSkills(skillsRes.data.skills || [])
        if (achievementsRes.data?.success) setAchievements(achievementsRes.data.achievements || [])
        if (educationRes.data?.success) setEducation(educationRes.data.education || [])
        setError(false)
      } catch (err) {
        if (cancelled) return
        setError(true)
        toast.error("Failed to load portfolio content")
      } finally {
        finishLoading()
      }
    }
    load()

    return () => {
      cancelled = true
      if (minTimerRef.current) {
        clearTimeout(minTimerRef.current)
        minTimerRef.current = null
      }
    }
  }, [backendUrl, reloadToken])

  // Skills are stored as a flat list with a `category` column. Group them
  // by category for the Skills section (mirroring resume.json shape).
  const skillsByCategory = useMemo(() => {
    const map = {}
    skills.forEach((s) => {
      if (!map[s.category]) map[s.category] = []
      map[s.category].push(s)
    })
    return map
  }, [skills])

  const value = {
    backendUrl,
    loading,
    isHydrated: !loading,
    error,
    retry,
    profile,
    projects,
    experience,
    skills,
    skillsByCategory,
    achievements,
    education,
  }

  return (
    <PortfolioContext.Provider value={value}>
      {props.children}
    </PortfolioContext.Provider>
  )
}

export default PortfolioContextProvider
