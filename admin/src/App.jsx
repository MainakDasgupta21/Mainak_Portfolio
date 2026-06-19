import React, { Suspense, lazy, useEffect, useState } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import Login from "./components/Login"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import LoadingState from "./components/ui/LoadingState"
import ToastConfig from "./components/ui/ToastConfig"

const ProfileEditor = lazy(() => import("./pages/ProfileEditor"))
const AddProject = lazy(() => import("./pages/AddProject"))
const ListProjects = lazy(() => import("./pages/ListProjects"))
const AddExperience = lazy(() => import("./pages/AddExperience"))
const ListExperience = lazy(() => import("./pages/ListExperience"))
const AddSkill = lazy(() => import("./pages/AddSkill"))
const ListSkills = lazy(() => import("./pages/ListSkills"))
const AddAchievement = lazy(() => import("./pages/AddAchievement"))
const ListAchievements = lazy(() => import("./pages/ListAchievements"))
const AddTestimonial = lazy(() => import("./pages/AddTestimonial"))
const ListTestimonials = lazy(() => import("./pages/ListTestimonials"))
const AddEducation = lazy(() => import("./pages/AddEducation"))
const ListEducation = lazy(() => import("./pages/ListEducation"))
const Media = lazy(() => import("./pages/Media"))
const Messages = lazy(() => import("./pages/Messages"))

export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {
  const location = useLocation()
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (token) localStorage.setItem("token", token)
    else localStorage.removeItem("token")
  }, [token])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const titles = {
      "/profile": "Profile",
      "/projects": "Projects",
      "/experience": "Experience",
      "/skills": "Skills",
      "/achievements": "Achievements",
      "/testimonials": "Testimonials",
      "/education": "Education",
      "/media": "Media",
      "/messages": "Messages",
    }
    const matchedPrefix = Object.keys(titles).find((route) => location.pathname.startsWith(route))
    const section = matchedPrefix ? titles[matchedPrefix] : "Admin"
    document.title = `${section} - Portfolio Admin`
  }, [location.pathname])

  if (!token) {
    return (
      <div className="min-h-screen bg-canvas">
        <ToastConfig />
        <Login setToken={setToken} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas text-text-main">
      <ToastConfig />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-border/70 bg-surface">
        <Navbar setToken={setToken} onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      </header>
      <div className="mx-auto flex w-full max-w-[1480px]">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main id="main-content" className="w-full flex-1 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
          <Suspense fallback={<LoadingState label="Loading admin section..." />}>
            <Routes>
              <Route path="/" element={<Navigate to="/profile" replace />} />
              <Route path="/profile" element={<ProfileEditor token={token} />} />

              <Route path="/projects" element={<ListProjects token={token} />} />
              <Route path="/projects/add" element={<AddProject token={token} />} />
              <Route path="/projects/:id/edit" element={<AddProject token={token} />} />

              <Route path="/experience" element={<ListExperience token={token} />} />
              <Route path="/experience/add" element={<AddExperience token={token} />} />
              <Route path="/experience/:id/edit" element={<AddExperience token={token} />} />

              <Route path="/skills" element={<ListSkills token={token} />} />
              <Route path="/skills/add" element={<AddSkill token={token} />} />
              <Route path="/skills/:id/edit" element={<AddSkill token={token} />} />

              <Route path="/achievements" element={<ListAchievements token={token} />} />
              <Route path="/achievements/add" element={<AddAchievement token={token} />} />
              <Route path="/achievements/:id/edit" element={<AddAchievement token={token} />} />

              <Route path="/testimonials" element={<ListTestimonials token={token} />} />
              <Route path="/testimonials/add" element={<AddTestimonial token={token} />} />
              <Route path="/testimonials/:id/edit" element={<AddTestimonial token={token} />} />

              <Route path="/education" element={<ListEducation token={token} />} />
              <Route path="/education/add" element={<AddEducation token={token} />} />
              <Route path="/education/:id/edit" element={<AddEducation token={token} />} />

              <Route path="/media" element={<Media token={token} />} />
              <Route path="/messages" element={<Messages token={token} />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default App
