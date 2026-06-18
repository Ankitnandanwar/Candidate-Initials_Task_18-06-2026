import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DEPARTMENTS } from "../assets/dummyData"
import { Loader2Icon } from "lucide-react"
import axios from "axios"

const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const token = localStorage.getItem("token")
            const formData = new FormData(e.currentTarget)
            
            // Map individual input name nodes directly into a structured payload
            const payload = Object.fromEntries(formData.entries())
            
            if (isEditMode) {
                const targetId = initialData._id || initialData.id
                await axios.put(`http://localhost:5000/api/employees/${targetId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            } else {
                await axios.post("http://localhost:5000/api/employees", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            }
            
            if (onSuccess) onSuccess()
        } catch (error) {
            console.error("Form handling process caught an exception:", error)
            alert(error.response?.data?.message || "Failed saving changes onto the server directory.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl animate-fade-in">

            {/* personal info */}
            <div className="card p-5 sm:p-6">
                <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                    <div>
                        <label className="block mb-2">First Name</label>
                        <input name="firstName" required className="w-full"
                            defaultValue={initialData?.firstName} />
                    </div>

                    <div>
                        <label className="block mb-2">Last Name</label>
                        <input name="lastName" required className="w-full"
                            defaultValue={initialData?.lastName} />
                    </div>

                    <div>
                        <label className="block mb-2">Phone no</label>
                        <input name="phone" required className="w-full"
                            defaultValue={initialData?.phone} />
                    </div>

                    <div>
                        <label className="block mb-2">Join Date</label>
                        <input type="date" name="joinDate" required className="w-full"
                            defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split("T")[0] : ""} />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block mb-2">Bio (Optional)</label>
                        <textarea name="bio" defaultValue={initialData?.bio} rows={3}
                            className="resize-none w-full" placeholder="Brief description..." />
                    </div>
                </div>
            </div>

            {/* Employee Department */}
            <div className="card p-5 sm:p-6">
                <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">Employment Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                    <div>
                        <label className="block mb-2">Department</label>
                        <select name="department" className="w-full"
                            defaultValue={initialData?.department || ""}>
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map((dept) => (
                                <option value={dept} key={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2">Position</label>
                        <input name="position" required className="w-full"
                            defaultValue={initialData?.position} />
                    </div>
                    <div>
                        <label className="block mb-2">Basic Salary</label>
                        <input type="number" name="basicSalary" required min="0" step="0.01" className="w-full"
                            defaultValue={initialData?.basicSalary || 0} />
                    </div>

                    <div>
                        <label className="block mb-2">Allowances</label>
                        <input type="number" name="allowances" min="0" step="0.01" required className="w-full"
                            defaultValue={initialData?.allowances || 0} />
                    </div>

                    <div>
                        <label className="block mb-2">Deductions</label>
                        <input type="number" name="deductions" min="0" step="0.01" required className="w-full"
                            defaultValue={initialData?.deductions || 0} />
                    </div>

                    {isEditMode && (
                        <div>
                            <label className="block mb-2">Status</label>
                            <select name="employmentStatus" className="w-full"
                                defaultValue={initialData?.employmentStatus || "ACTIVE"}>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Account setup */}
            <div className="card p-5 sm:p-6">
                <h3 className="font-medium text-base text-slate-900 mb-6 pb-4 border-b border-slate-100">Account Setup</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                    <div className="sm:col-span-2">
                        <label className="block mb-2">Work Email</label>
                        <input type="email" name="email" required className="w-full"
                            defaultValue={initialData?.email} />
                    </div>

                    {!isEditMode && (
                        <div>
                            <label className="block mb-2">Temporary Password</label>
                            <input type="password" name="password" required className="w-full" />
                        </div>
                    )}

                    {isEditMode && (
                        <div>
                            <label className="block mb-2">Change Password (Optional)</label>
                            <input type="password" name="password" className="w-full" placeholder="Leave blank to keep same" />
                        </div>
                    )}

                    <div>
                        <label className="block mb-2">System Role</label>
                        <select name="role" className="w-full"
                            defaultValue={initialData?.user?.role || initialData?.userId?.role || "EMPLOYEE"}>
                            <option value="EMPLOYEE">Employee</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={() => (onCancel ? onCancel() : navigate(-1))}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex justify-center items-center">
                    {loading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin"/>}
                    {isEditMode ? "Update Employee" : "Create Employee"}
                </button>
            </div>

        </form>
    )
}

export default EmployeeForm