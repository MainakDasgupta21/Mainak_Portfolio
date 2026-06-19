import { lazy, Suspense, useContext, useEffect, useState } from "react"
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Header from "./components/Header"
import Hero from "./components/Hero"
import AppLoader from "./components/AppLoader"
import LazySection from "./components/LazySection"
import SectionSkeleton from "./components/SectionSkeleton"
import { PortfolioContext } from "./context/PortfolioContext"
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
  const { loading } = useContext(PortfolioContext)

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

  if (loading) {
    return (
      <LazyMotion features={domAnimation}>
        <MotionConfig reducedMotion="user">
          <div className="min-h-screen relative">
            <ToastContainer position="bottom-right" theme="dark" />
            <div className="fixed inset-0 -z-10">
              {bgReady && (
                <Suspense fallback={null}>
                  <AnimatedBackground />
                </Suspense>
              )}
            </div>
            <AppLoader />
          </div>
        </MotionConfig>
      </LazyMotion>
    )
  }

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
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
            <LazySection>
              <Suspense fallback={<SectionSkeleton />}>
                <About />
              </Suspense>
            </LazySection>
            <LazySection>
              <Suspense fallback={<SectionSkeleton />}>
                <Experience />
              </Suspense>
            </LazySection>
            <LazySection>
              <Suspense fallback={<SectionSkeleton />}>
                <Projects />
              </Suspense>
            </LazySection>
            <LazySection>
              <Suspense fallback={<SectionSkeleton />}>
                <Skills />
              </Suspense>
            </LazySection>
            <LazySection>
              <Suspense fallback={<SectionSkeleton />}>
                <Achievements />
              </Suspense>
            </LazySection>
            <LazySection>
              <Suspense fallback={<SectionSkeleton />}>
                <Testimonials />
              </Suspense>
            </LazySection>
            <LazySection>
              <Suspense fallback={<SectionSkeleton />}>
                <Contact />
              </Suspense>
            </LazySection>
            <LazySection minHeight={200}>
              <Suspense fallback={<SectionSkeleton />}>
                <Footer />
              </Suspense>
            </LazySection>
          </main>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}

export default App
