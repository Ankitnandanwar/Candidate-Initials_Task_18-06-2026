import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import LoginLeftBar from "./LoginLeftBar"
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react"
import axios from "axios" // or import API from '../api/axios'

const LoginForm = ({ role, title, subtitle }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Connects directly to your Express route
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      })

      if (response.data.success) {
        const userRole = response.data.user.role

        // Enforce role matching based on which panel they are trying to log into
        if (userRole !== role) {
          setError(`Access denied. This account does not have ${role} privileges.`)
          setLoading(false)
          return
        }

        // Save token & user details to state/storage
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        // Redirect safely into your layout route structure
        navigate("/dashboard")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftBar />

      <div className="flex-1 flex justify-center items-center p-6 bg-white sm:p-12">
        <div className="w-full max-w-md animate-fade-in">

          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 mb-10 transition-colors">
            <ArrowLeftIcon size={16} />
            Back to Login
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium text-zinc-800">{title}</h1>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">{subtitle}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full border border-slate-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  className="w-full border border-slate-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                  Authenticating...
                </>
              ) : "Sign in"}
            </button>

          </form>

        </div>
      </div>
    </div>
  )
}

export default LoginForm