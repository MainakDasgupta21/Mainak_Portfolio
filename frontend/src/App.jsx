import { lazy, Suspense, useContext, useEffect, useState } from "react"
import { LazyMotion, MotionConfig, domMax } from "framer-motion"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Header from "./components/Header"
import Hero from "./components/Hero"
import About from "./components/About"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import Achievements from "./components/Achievements"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import SectionsSkeleton from "./components/SectionSkeleton"
import ContentError from "./components/ContentError"
import { PortfolioContext } from "./context/PortfolioContext"
import useSmoothScroll from "./hooks/useSmoothScroll"

const AnimatedBackground = lazy(() => import("./components/AnimatedBackground"))

const App = () => {
  useSmoothScroll()
  const { loading, error, retry } = useContext(PortfolioContext)

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

  // Progressive load: the header + hero render instantly with defaults (they
  // need no API data), while the data-driven sections below the fold show
  // layout-matched skeletons until content arrives, then cross-fade in.
  const renderSections = () => {
    if (error) return <ContentError onRetry={retry} />
    if (loading) return <SectionsSkeleton />
    return (
      <div className="loader-content-reveal">
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
      </div>
    )
  }

  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen relative">
          <ToastContainer position="bottom-right" theme="dark" />

          {loading && !error && <div className="loader-topbar" aria-hidden="true" />}

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
            {renderSections()}
            <Footer />
          </main>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}

export default App
