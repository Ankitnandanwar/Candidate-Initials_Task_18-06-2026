import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { CalendarIcon, ChevronRightIcon, DollarSignIcon, FileTextIcon, LayoutGridIcon, LogOutIcon, MenuIcon, SettingsIcon, UserIcon, XIcon, UsersIcon } from "lucide-react"

const Sidebar = () => {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [openMobileMenu, setOpenMobileMenu] = useState(false)

    // Parse the live logged-in user profile from storage
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    useEffect(() => {
        setOpenMobileMenu(false)
    }, [pathname])

    // Get live role string (lowercase matching database setup, fallback to employee)
    const role = user?.role || "employee"

    // Dynamically filter menu configurations according to evaluation guidelines
    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
        ...(role === "admin" 
            ? [{ name: "Employees", href: "/employees", icon: UsersIcon }] // Admin sees employee directory [cite: 33]
            : [{ name: "Attendance", href: "/attendance", icon: CalendarIcon }] // Employee tracks attendance self-service [cite: 44]
        ),
        { name: "Leave", href: "/leave", icon: FileTextIcon },
        { name: "Payroll", href: "/payslips", icon: DollarSignIcon },
        { name: "Settings", href: "/settings", icon: SettingsIcon },
    ]

    // Use proper client redirection cleanup
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/login")
    }

    const sidebarContent = (
        <>
            {/* Header */}
            <div className="px-6 pt-6 pb-5 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UserIcon size={20} className="text-white" />
                        <div>
                            <p className="font-semibold text-[13px] text-white tracking-wide">Employee MS</p>
                            <p className="text-[11px] text-slate-500 font-medium">Management System</p>
                        </div>
                    </div>
                    <button className="lg:hidden text-slate-400 hover:text-white p-1"
                        onClick={() => setOpenMobileMenu(!openMobileMenu)}>
                        <XIcon size={20} className="text-white" />
                    </button>
                </div>
            </div>

            {/* Dynamic Live User Info Card */}
            {
                user && (
                    <div className="mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="px-2">
                            <p className="font-semibold text-white mb-1 capitalize">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-[11px] text-indigo-400 font-medium uppercase tracking-wider">
                                {role === "admin" ? "HR Administrator" : "Employee"}
                            </p>
                        </div>
                    </div>
                )
            }

            {/* Menu Items */}
            <div className="px-5 pt-5 pb-2">
                <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Navigation</p>
            </div>

            <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                {
                    navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link key={item.name} to={item.href} 
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px]
                            font-medium transition-all relative duration-150 ${isActive ? "bg-indigo-600 text-white" : 
                            "text-slate-300 hover:text-white hover:bg-white/5"}`}>
                                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white"/>}
                                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : 
                                    "text-slate-400 group-hover:text-slate-300"}`}/>
                                <span className="flex-1">{item.name}</span>
                                {isActive && <ChevronRightIcon className="w-3.5 h-3.5 text-indigo-200"/>}
                            </Link>
                        )
                    })
                }
            </div>

            {/* Logout Button */}
            <div className="p-3 border-t border-white/5">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 
                rounded-md font-medium text-sm text-slate-400 transition-all duration-200
                hover:text-rose-400 hover:bg-rose-500/10">
                    <LogOutIcon className="w-4 h-4"/>
                    <span>Log out</span>
                </button>
            </div>
        </>
    )

    return (
        <>
            <button className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900 text-white shadow-lg border border-white/20"
                onClick={() => setOpenMobileMenu(!openMobileMenu)}>
                <MenuIcon size={20} />
            </button>

            {
                openMobileMenu &&
                <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setOpenMobileMenu(!openMobileMenu)} />
            }

            {/* Sidebar Content - Desktop */}
            <aside className="hidden lg:flex flex-col h-full w-64 bg-slate-950 text-white shrink-0 border-r border-white/5">
                {sidebarContent}
            </aside>

            {/* Sidebar Content - Mobile */}
            <aside className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-slate-950 text-white z-50 flex flex-col transform transition-transform duration-300
                ${openMobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
                {sidebarContent}
            </aside>
        </>
    )
}

export default Sidebar