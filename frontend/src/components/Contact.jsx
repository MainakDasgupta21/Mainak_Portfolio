import { motion, useInView } from "framer-motion"
import { memo, useContext, useRef, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Github, Linkedin, Code2, Twitter, Mail, Phone } from "lucide-react"
import { PortfolioContext } from "../context/PortfolioContext"

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  leetcode: Code2,
  codeforces: Code2,
  geekforgeeks: Code2,
  twitter: Twitter,
}

const Contact = memo(function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { profile, backendUrl } = useContext(PortfolioContext)
  const subtitle =
    profile.sectionSubtitles?.contact || "Let's discuss your next project"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const data = {
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
    }
    try {
      const res = await axios.post(backendUrl + "/api/contact/submit", data)
      if (res.data.success) {
        toast.success("Message sent successfully! I'll get back to you soon.")
        e.target.reset()
      } else {
        toast.error(res.data.message || "Failed to send")
      }
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 md:py-32 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6">Get in Touch</h2>
          <div className="w-16 md:w-20 h-1 bg-accent mx-auto mb-6 md:mb-8" />
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">{subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-5 md:mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              <div>
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                  id="name"
                  name="name"
                  required
                  placeholder="Your name"
                  className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                />
              </div>
              <div>
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  required
                  placeholder="What's this about?"
                  className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Tell me more about your project..."
                  className="mt-2 w-full min-h-32 px-3 py-2 rounded-md border border-input bg-background text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-5 md:mb-6">Contact Information</h3>
              <div className="space-y-4">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-3 md:gap-4 glass-card p-3 md:p-4 rounded-lg hover:shadow-glow transition-all min-w-0"
                  >
                    <div className="p-2.5 md:p-3 bg-accent/10 rounded-lg flex-shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-sm md:text-base break-all">{profile.email}</p>
                    </div>
                  </a>
                )}
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-3 md:gap-4 glass-card p-3 md:p-4 rounded-lg hover:shadow-glow transition-all"
                  >
                    <div className="p-2.5 md:p-3 bg-accent/10 rounded-lg flex-shrink-0">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-sm md:text-base">{profile.phone}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-5 md:mb-6">Connect With Me</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {Object.entries(profile.links || {})
                  .filter(([, url]) => Boolean(url))
                  .map(([platform, url]) => {
                    const Icon = socialIcons[platform] || Code2
                    return (
                      <motion.a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -4 }}
                        className="glass-card p-3.5 md:p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:shadow-glow transition-all min-h-[84px] md:min-h-[96px]"
                      >
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                        <span className="text-[11px] md:text-xs capitalize text-center">{platform}</span>
                      </motion.a>
                    )
                  })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
})

export default Contact
