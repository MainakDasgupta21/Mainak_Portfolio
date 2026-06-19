import { lazy, Suspense, useEffect, useState } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Header from "./components/Header"
import Hero from "./components/Hero"
import LazySection from "./components/LazySection"
import SectionSkeleton from "./components/SectionSkeleton"
import useSmoothScroll from "./hooks/useSmoothScroll"

const About = lazy(() => import("./components/About"))
const Experience = lazy(() => import("./components/Experience"))
const Projects = lazy(() => import("./components/Projects"))
const Skills = lazy(() => import("./components/Skills"))
const Achievements = lazy(() => import("./components/Achievements"))
const Testimonials = lazy(() => import("./components/Testimonials"))
const Contact = lazy(() => import("./components/Contact"))
const Footer = lazy(() => import("./components/Footer"))
const AnimatedBackground = lazy(() => import("./components/AnimatedBackground"))

const App = () => {
  useSmoothScroll()

  const [bgReady, setBgReady] = useState(false)
  useEffect(() => {
    const w = window
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(() => setBgReady(true))
    } else {
      const t = setTimeout(() => setBgReady(true), 0)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <div className="min-h-screen relative">
      <ToastContainer position="bottom-right" theme="dark" />
      <div className="fixed inset-0 -z-10">
        {bgReady && (
          <Suspense fallback={null}>
            <AnimatedBackground />
          </Suspense>
        )}
      </div>
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<SectionSkeleton />}>
          <LazySection><About /></LazySection>
          <LazySection><Experience /></LazySection>
          <LazySection><Projects /></LazySection>
          <LazySection><Skills /></LazySection>
          <LazySection><Achievements /></LazySection>
          <LazySection><Testimonials /></LazySection>
          <LazySection><Contact /></LazySection>
          <LazySection minHeight={200}><Footer /></LazySection>
        </Suspense>
      </main>
    </div>
  )
}

export default App
