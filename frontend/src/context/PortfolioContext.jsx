import { createContext, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const PortfolioContext = createContext({})

const DEFAULTS = {
  profile: {
    name: "Mainak Dasgupta",
    title: "Software Developer",
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
      testimonials: "What colleagues and mentors say",
      contact: "Let's discuss your next project",
    },
    coursework: [],
  },
  projects: [],
  experience: [],
  skills: [],
  achievements: [],
  testimonials: [],
  education: [],
}

const PortfolioContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || ""

  const [profile, setProfile] = useState(DEFAULTS.profile)
  const [projects, setProjects] = useState(DEFAULTS.projects)
  const [experience, setExperience] = useState(DEFAULTS.experience)
  const [skills, setSkills] = useState(DEFAULTS.skills)
  const [achievements, setAchievements] = useState(DEFAULTS.achievements)
  const [testimonials, setTestimonials] = useState(DEFAULTS.testimonials)
  const [education, setEducation] = useState(DEFAULTS.education)
  // `loading` tracks the initial content hydration window.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!backendUrl) {
        setLoading(false)
        return
      }
      try {
        const [
          profileRes,
          projectsRes,
          experienceRes,
          skillsRes,
          achievementsRes,
          testimonialsRes,
          educationRes,
        ] = await Promise.all([
          axios.get(backendUrl + "/api/profile"),
          axios.get(backendUrl + "/api/project/list"),
          axios.get(backendUrl + "/api/experience/list"),
          axios.get(backendUrl + "/api/skill/list"),
          axios.get(backendUrl + "/api/achievement/list"),
          axios.get(backendUrl + "/api/testimonial/list"),
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
        if (testimonialsRes.data?.success) setTestimonials(testimonialsRes.data.testimonials || [])
        if (educationRes.data?.success) setEducation(educationRes.data.education || [])
      } catch (err) {
        console.log(err)
        toast.error("Failed to load portfolio content")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [backendUrl])

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
    profile,
    projects,
    experience,
    skills,
    skillsByCategory,
    achievements,
    testimonials,
    education,
  }

  return (
    <PortfolioContext.Provider value={value}>
      {props.children}
    </PortfolioContext.Provider>
  )
}

export default PortfolioContextProvider
