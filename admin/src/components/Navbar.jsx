import { useState } from "react"
import { assets } from "../assets/assets"
import Button from "./ui/Button"
import ConfirmDialog from "./ui/ConfirmDialog"

const Navbar = ({ setToken, onMenuToggle }) => {
  const [confirmLogout, setConfirmLogout] = useState(false)

  return (
    <>
      <div className="mx-auto flex h-14 w-full max-w-[1480px] items-center justify-between gap-3 px-3 sm:px-5 lg:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            aria-label="Toggle sidebar menu"
            onClick={onMenuToggle}
          >
            Menu
          </Button>
          <img className="h-8 w-auto" src={assets.logo} alt="Mainak admin logo" />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <p className="text-xs text-text-muted">Content management</p>
        </div>

        <Button variant="ghost" size="sm" onClick={() => setConfirmLogout(true)}>
          Logout
        </Button>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Log out from admin?"
        description="You will need to sign in again to manage portfolio content."
        confirmLabel="Log out"
        confirmVariant="danger"
        onClose={() => setConfirmLogout(false)}
        onConfirm={() => setToken("")}
      />
    </>
  )
}

export default Navbar
