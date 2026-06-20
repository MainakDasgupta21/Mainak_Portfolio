import { lazy, Suspense, useContext, useEffect, useState } from "react"
import { LazyMotion, MotionConfig, domMax } from "framer-motion"
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
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import { PortfolioContext } from "./context/PortfolioContext"
import useSmoothScroll from "./hooks/useSmoothScroll"

const AnimatedBackground = lazy(() => import("./components/AnimatedBackground"))
const LOADER_EXIT_MS = 420

const App = () => {
  useSmoothScroll()
  const { loading } = useContext(PortfolioContext)

  const [bgReady, setBgReady] = useState(false)
  const [loaderMounted, setLoaderMounted] = useState(true)
  const [loaderExiting, setLoaderExiting] = useState(false)

  useEffect(() => {
    const w = window
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(() => setBgReady(true))
    } else {
      const t = setTimeout(() => setBgReady(true), 0)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    if (loading) {
      setLoaderMounted(true)
      setLoaderExiting(false)
      return
    }

    if (!loaderMounted) return

    setLoaderExiting(true)
    const timeout = setTimeout(() => {
      setLoaderMounted(false)
      setLoaderExiting(false)
    }, LOADER_EXIT_MS)

    return () => clearTimeout(timeout)
  }, [loading, loaderMounted])

  return (
    <LazyMotion features={domMax}>
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

          {!loading && (
            <div className={loaderMounted ? "loader-content-reveal" : undefined}>
              <Header />
              <main>
                <Hero />
                <About />
                <Experience />
                <Projects />
                <Skills />
                <Achievements />
                <Contact />
                <Footer />
              </main>
            </div>
          )}

          {loaderMounted && <AppLoader isExiting={loaderExiting} />}
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}

export default App
