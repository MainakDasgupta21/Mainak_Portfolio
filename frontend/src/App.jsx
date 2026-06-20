import { lazy, Suspense, useContext, useEffect, useState } from "react"
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Header from "./components/Header"
import Hero from "./components/Hero"
import AppLoader from "./components/AppLoader"
import About from "./components/About"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import Achievements from "./components/Achievements"
import Testimonials from "./components/Testimonials"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import { PortfolioContext } from "./context/PortfolioContext"
import useSmoothScroll from "./hooks/useSmoothScroll"

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
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Achievements />
            <Testimonials />
            <Contact />
            <Footer />
          </main>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}

export default App
