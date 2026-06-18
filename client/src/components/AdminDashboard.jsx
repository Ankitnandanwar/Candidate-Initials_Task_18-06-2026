import { Building2Icon, CalendarIcon, FileTextIcon, UserIcon } from "lucide-react"

const AdminDashboard = ({ data }) => {
    // 1. Safely pull down raw telemetry from our unified state payload
    const logCollection = data?.rawLogs || []
    
    // 2. Compute live aggregates locally from our relational database tables
    const employeeCount = data?.summaryData?.totalEmployees || logCollection.length || 0
    const departmentCount = data?.summaryData?.totalDepartments || 7 // Standard fallback matching static configuration
    
    // Check for today's logs (matching current date strings)
    const todayStr = new Date().toISOString().split('T')[0]
    const todayAttendance = logCollection.filter(log => log.date && log.date.startsWith(todayStr)).length

    // Temporary placeholder for active leave state counters
    const pendingLeaves = data?.summaryData?.pendingLeaves || 0

    const stats = [
        {
            icon: UserIcon,
            value: employeeCount,
            label: "Total Employees",
            description: "Active workforce"
        },
        {
            icon: Building2Icon,
            value: departmentCount,
            label: "Departments",
            description: "Organisation Units"
        },
        {
            icon: CalendarIcon,
            value: todayAttendance,
            label: "Todays Attendance",
            description: "Check in today"
        },
        {
            icon: FileTextIcon,
            value: pendingLeaves,
            label: "Pending Leaves",
            description: "Awaiting approval"
        },
    ]

    return (
        <div className='animate-fade-in'>
            <div className='page-header'>
                <h1 className='page-title'>Dashboard</h1>
                <p className='page-subtitle'>Welcome back, Admin - here's your overview</p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8'>
                {
                    stats.map((item)=>(
                        <div key={item.label} className='card card-hover p-5 sm:p-6 relative
                        overflow-hidden group flex items-center justify-between'>
                            <div>
                                <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full
                                bg-slate-500/70 group-hover:bg-indigo-500/70'/>
                                <p className='text-sm font-medium text-slate-700'>{item.label}</p>
                                <p className='text-2xl font-bold mt-1 text-slate-900'>{item.value}</p>
                            </div>
                            <item.icon className="size-10 p-2.5 rounded-lg
                            bg-slate-100 text-slate-600 group-hover:bg-indigo-50
                            group-hover:text-indigo-600 transition-colors duration-200"/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AdminDashboard