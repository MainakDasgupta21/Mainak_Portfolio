import { useState } from "react"
import { assets } from "../assets/assets"
import Button from "./ui/Button"
import ConfirmDialog from "./ui/ConfirmDialog"

const Navbar = ({ setToken, onMenuToggle }) => {
  const [confirmLogout, setConfirmLogout] = useState(false)

  return (
    <>
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="md:hidden"
            aria-label="Toggle sidebar menu"
            onClick={onMenuToggle}
          >
            Menu
          </Button>
          <img className="h-9 w-auto" src={assets.logo} alt="Mainak admin logo" />
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <p className="text-sm text-text-muted">Portfolio Content Studio</p>
        </div>

        <Button variant="secondary" size="sm" onClick={() => setConfirmLogout(true)}>
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
