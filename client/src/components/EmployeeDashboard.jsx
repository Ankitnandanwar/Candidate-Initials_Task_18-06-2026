import { ArrowRightIcon, CalendarIcon, DollarSignIcon, FileTextIcon } from "lucide-react"
import { Link } from 'react-router-dom'

const EmployeeDashboard = ({ data }) => {
    // 1. Resolve user profile structure out of session container
    const profile = data?.user;
    const personalLogs = data?.rawLogs || [];

    // 2. Filter attendance history for records matching the current month on the client-side
    const currentMonthIndex = new Date().getMonth(); // 0-11
    const currentYear = new Date().getFullYear();
    
    const presentDaysThisMonth = personalLogs.filter(log => {
        if (!log.date) return false;
        const logDate = new Date(log.date);
        return logDate.getMonth() === currentMonthIndex && logDate.getFullYear() === currentYear && log.status === "PRESENT";
    }).length;

    // Fallbacks for data metrics that will be filled out by other specific views
    const pendingLeavesCount = data?.pendingLeavesCount || 0;
    const netSalaryValue = data?.payrollSummary?.netSalary || profile?.basicSalary || 0;

    const cards = [
        {
            icon: CalendarIcon,
            value: presentDaysThisMonth,
            title: "Days Present",
            subtitle: "This month"
        },
        {
            icon: FileTextIcon,
            value: pendingLeavesCount,
            title: "Pending Leaves",
            subtitle: "Awaiting approval"
        },
        {
            icon: DollarSignIcon,
            value: netSalaryValue ? `$${netSalaryValue.toLocaleString()}` : "N/A",
            title: "Latest Payslip",
            subtitle: "Most recent payout"
        },
    ]

    return (
        <div className='animate-fade-in'>
            <div className='page-header'>
                <h1 className='page-title'>Welcome, {profile?.firstName || "Employee"}</h1>
                <p className='page-subtitle'>
                    {profile?.role === 'admin' ? 'Administrator' : 'Staff Associate'} — {profile?.email}
                </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8'>
                {
                    cards.map((item, index)=>(
                        <div key={index} className='card card-hover p-5 sm:p-6 relative
                        overflow-hidden group flex items-center justify-between'>
                            <div>
                                <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full
                                bg-slate-500/70 group-hover:bg-indigo-500/70'/>
                                <p className='text-sm font-medium text-slate-700'>{item.title}</p>
                                <p className='text-2xl font-bold mt-1 text-slate-900'>{item.value}</p>
                            </div>
                            <item.icon className="size-10 p-2.5 rounded-lg
                            bg-slate-100 text-slate-600 group-hover:bg-indigo-50
                            group-hover:text-indigo-600 transition-colors duration-200"/>
                        </div>
                    ))
                }
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
                <Link to="/attendance" className='btn-primary text-center inline-flex
                items-center justify-center gap-2 px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors'>
                    Mark Attendance <ArrowRightIcon size={14}/>
                </Link>

                <Link to="/leave" className='btn-secondary text-center px-4 py-2 rounded border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors'>
                    Apply for Leave
                </Link>
            </div>
        </div>
    )
}

export default EmployeeDashboard