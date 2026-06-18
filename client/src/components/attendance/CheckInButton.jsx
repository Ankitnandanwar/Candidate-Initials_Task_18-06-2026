import { Loader2Icon, LogInIcon, LogOutIcon } from "lucide-react"
import { useState } from "react"
import axios from "axios"

const CheckInButton = ({ todayRecord, onAction }) => {

    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")

            // Toggle endpoints dynamically depending on the current shift status
            const endpoint = isCheckedIn
                ? "http://localhost:5000/api/attendance/clock-out"
                : "http://localhost:5000/api/attendance/clock-in"

            await axios.post(endpoint, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // Trigger a parent re-fetch to sync state across views instantly
            onAction()
        } catch (error) {
            console.error("Attendance operation failed:", error.response?.data?.message || error.message)
            alert(error.response?.data?.message || "Operation failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (todayRecord?.checkOut ) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl
            border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Work day Completed</h3>
                <p className="text-slate-500 text-sm mt-1">Great job! See you tomorrow</p>
            </div>
        )
    }

    const isCheckedIn = !!todayRecord?.isCheckedIn

    return (
        <div className="absolute bottom-4 right-4 flex flex-col z-1">
            <button onClick={handleSubmit} disabled={loading} className={`w-full max-w-xs flex justify-between items-center gap-8
        p-4 rounded-xl bg-linear-to-br text-white ${isCheckedIn ? "from-slate-700 to-slate-900" : "from-indigo-600 to-indigo-700"}`}>{loading ? <Loader2Icon className="size-7 animate-spin" /> :
                    isCheckedIn ? <LogOutIcon className="size-7" /> : <LogInIcon className="size-7" />}

                <div className="relative flex flex-col items-center text-center">
                    <h2 className="text-lg font-medium mb-1">{loading ? "Processing..." : isCheckedIn ? "Clock Out" : "Clock In"}</h2>
                    <p className="text-xs opacity-80">{isCheckedIn ? "Click to end your shift" : "start your work day"}</p>
                </div>
            </button>
        </div>
    )
}

export default CheckInButton