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
  `block w-full rounded-md border-l-2 px-2.5 py-2 text-sm transition-colors ${
    isActive
      ? "active border-l-brand font-medium"
      : "border-l-transparent text-text-muted hover:bg-surface-soft/70 hover:text-text-main"
  }`

const Sidebar = ({ mobileOpen, onClose }) => {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[min(100vw-2.5rem,16rem)] overflow-x-hidden border-r border-border/70 bg-surface px-3 py-4 transition-transform duration-200 ease-out md:sticky md:inset-y-auto md:left-auto md:top-14 md:h-[calc(100vh-3.5rem)] md:w-56 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <nav aria-label="Admin navigation" className="flex h-full flex-col overflow-x-hidden overflow-y-auto">
          <div className="mb-2 md:hidden">
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-md px-2 text-xs text-text-muted hover:bg-surface-soft hover:text-text-main"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          <div>
            <p className="mb-1 px-2 text-[11px] text-text-muted">Content</p>
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

          <div className="mt-5">
            <p className="mb-1 px-2 text-[11px] text-text-muted">Inbox & assets</p>
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
