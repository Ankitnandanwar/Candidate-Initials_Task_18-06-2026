import LoginLeftBar from "../components/LoginLeftBar"
import { ShieldIcon, UserIcon, ArrowRightIcon } from "lucide-react"
import { Link } from "react-router-dom"

const Login = () => {

  const portalOptions = [
    {
      to: "/login/admin",
      title: "Admin / HR Panel",
      desc: "Sign in to your admin account",
      icon: ShieldIcon
    },
    {
      to: "/login/employee",
      title: "Employee Panel",
      desc: "Sign in to your employee account",
      icon: UserIcon
    }
  ]

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftBar />

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6
      sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen">

        <div className="w-full max-w-md animate-fade-in relative z-10">
          {/* Header */}
          <div className="text-center md:text-left mb-10">
            <h1 className="text-3xl font-medium text-slate-900 tracking-tight mb-3">Welcome Back!</h1>
            <p className="text-slate-500">Please sign in to your account</p>
          </div>

          {/* Portal List */}
          <div className="space-y-4">
            {portalOptions.map((option) => (
              <Link key={option.to} to={option.to} className="group block bg-slate-50 
              border border-slate-200 rounded-lg p-4 sm:p-6 transition-all duration-200
              hover:border-indigo-400 hover:bg-indigo-50">
                <div className="relative z-10 flex items-center justify-between gap-4 sm:gap-5">
                  <h3 className="text-lg text-slate-800 group-hover:text-indigo-600 mb-1 transition-colors">{option.title}</h3>
                  <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login