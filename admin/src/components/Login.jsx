import axios from "axios"
import { useState } from "react"
import { toast } from "react-toastify"
import { backendUrl } from "../App"
import Button from "./ui/Button"
import Card from "./ui/Card"
import Field from "./ui/Field"
import Input from "./ui/Input"

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await axios.post(backendUrl + "/api/user/admin", { email, password })
      if (response.data.success) {
        setToken(response.data.token)
      } else {
        toast.error(response.data.message || "Unable to sign in")
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-md p-7 sm:p-8">
        <h1 className="text-2xl font-bold text-text-main">Admin Panel</h1>
        <p className="mt-1 text-sm text-text-muted">Mainak Dasgupta - Portfolio CMS</p>
        <form onSubmit={onSubmitHandler} className="mt-5 space-y-4" noValidate>
          <Field label="Email address" htmlFor="admin-email" required>
            <Input
              id="admin-email"
              type="email"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mainak.dev"
              required
            />
          </Field>
          <Field label="Password" htmlFor="admin-password" required>
            <Input
              id="admin-password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </Field>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default Login
