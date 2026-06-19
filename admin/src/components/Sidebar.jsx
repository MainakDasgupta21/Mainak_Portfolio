import { NavLink } from "react-router-dom"

const contentItems = [
  { to: "/profile", label: "Profile" },
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "Experience" },
  { to: "/skills", label: "Skills" },
  { to: "/achievements", label: "Achievements" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/education", label: "Education" },
]

const utilityItems = [
  { to: "/media", label: "Media Library" },
  { to: "/messages", label: "Messages" },
]

const getNavClass = ({ isActive }) =>
  `rounded-xl border px-3 py-2.5 text-sm transition-colors ${
    isActive
      ? "active"
      : "border-transparent text-text-main hover:bg-surface-soft"
  }`

const Sidebar = ({ mobileOpen, onClose }) => {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-surface px-4 py-6 transition-transform duration-200 ease-out md:sticky md:inset-y-auto md:left-auto md:top-16 md:h-[calc(100vh-4rem)] md:w-64 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <nav aria-label="Admin navigation" className="flex h-full flex-col overflow-y-auto">
          <div>
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Content</p>
            <div className="space-y-1.5">
              {contentItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={getNavClass}
                  aria-label={item.label}
                  onClick={onClose}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Inbox & Assets</p>
            <div className="space-y-1.5">
              {utilityItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={getNavClass}
                  aria-label={item.label}
                  onClick={onClose}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
