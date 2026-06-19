import { motion } from "framer-motion"
import { memo, useContext } from "react"
import { Download } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"

function getBrandShortName(profile) {
  if (profile.brandShortName?.trim()) return profile.brandShortName
  const first = (profile.name || "").trim().split(/\s+/)[0]
  return first ? `${first}.` : "Portfolio"
}

const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear()
  const { profile } = useContext(PortfolioContext)
  const brandName = getBrandShortName(profile)
  const resumeUrl = profile.media?.resumePdf

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <footer className="bg-primary text-primary-foreground py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold cursive-brand mb-3 md:mb-4">
              {brandName}
            </h3>
            <p className="text-sm opacity-80">{profile.tagline}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4">Quick Links</h4>
            <nav className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  whileHover={{ x: 4 }}
                  className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <h4 className="font-semibold mb-3 md:mb-4">Download Resume</h4>
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-primary-foreground/20 hover:bg-primary-foreground/10 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Resume PDF
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-primary-foreground/20 opacity-60 text-sm cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Resume PDF
              </button>
            )}
          </div>
        </div>

        <div className="pt-6 md:pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-xs md:text-sm opacity-80">
            © {currentYear} {profile.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
})

export default Footer
