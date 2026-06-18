import { CalendarDays, FileText, Loader2Icon, Send, X } from "lucide-react"
import { useState } from "react"
import axios from "axios"

const ApplyLeaveModal = ({ open, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false)

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const minDate = tomorrow.toISOString().split('T')[0]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const payload = {
            type: formData.get("type"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            reason: formData.get("reason")
        }

        try {
            const token = localStorage.getItem("token")
            await axios.post("http://localhost:5000/api/leaves/apply", payload, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (onSuccess) onSuccess()
            onClose()
        } catch (error) {
            console.error("Failed submitting leave payload details:", error)
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
            <div className="fixed inset-0" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 pb-0">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Apply for leave</h2>
                        <p className="text-sm mt-0.5 text-slate-500">Submit your leave request for approval</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 p-6 animate-fade-in">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <FileText className="w-4 h-4 text-slate-400" /> Leave Type
                        </label>
                        <select name="type" required className="w-full">
                            <option value="SICK">Sick Leave</option>
                            <option value="CASUAL">Casual Leave</option>
                            <option value="ANNUAL">Annual Leave</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                            <CalendarDays className="w-4 h-4 text-slate-400" /> Duration
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-xs text-slate-400 mb-1">From</span>
                                <input type="date" name="startDate" required min={minDate} className="w-full" />
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400 mb-1">To</span>
                                <input type="date" name="endDate" required min={minDate} className="w-full" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Reason</label>
                        <textarea name="reason" rows={3} required className="resize-none w-full" placeholder="Briefly describe why you need leave..."></textarea>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} type="button" className="btn-secondary flex-1">Cancel</button>
                        <button disabled={loading} type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                            {loading ? <Loader2Icon className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
                            {loading ? "Submitting.." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ApplyLeaveModal