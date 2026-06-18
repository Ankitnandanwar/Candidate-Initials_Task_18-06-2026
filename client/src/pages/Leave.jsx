import { useCallback, useEffect, useState } from "react"
import Loading from "../components/Loading"
import { PalmtreeIcon, PlusIcon, ThermometerIcon, UmbrellaIcon } from "lucide-react"
import LeaveHistory from "../components/leave/LeaveHistory"
import ApplyLeaveModal from "../components/leave/ApplyLeaveModal"
import axios from "axios"

const Leave = () => {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  // Recommendation: Replace this with state parsed from your decoded JWT Auth Token
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role?.toUpperCase() === "ADMIN";

  const fetchLeaveData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const endpoint = isAdmin 
        ? "http://localhost:5000/api/leaves/all" 
        : "http://localhost:5000/api/leaves/my-requests"
        
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLeaves(response.data?.data || [])
    } catch (error) {
      console.error("Error retrieving dashboard leave applications:", error)
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    fetchLeaveData()
  }, [fetchLeaveData])

  if (loading) return <Loading />

  const approvedleaves = leaves.filter((l) => l.status === "APPROVED")
  const sickCount = approvedleaves.filter((l) => l.type === "SICK").length;
  const casualCount = approvedleaves.filter((l) => l.type === "CASUAL").length;
  const annualCount = approvedleaves.filter((l) => l.type === "ANNUAL").length;

  const leavesStats = [
    { label: "Sick Leave", value: sickCount, icon: ThermometerIcon },
    { label: "Casual Leave", value: casualCount, icon: UmbrellaIcon },
    { label: "Annual Leave", value: annualCount, icon: PalmtreeIcon },
  ]

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">{isAdmin ? "Manage leave application" : "Your leave history and request"}</p>
        </div>
        {!isAdmin && !isDeleted && (
          <button className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center" onClick={() => setShowModal(true)}>
            <PlusIcon className="w-4 h-4" /> Apply for leave
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 mb-8 gap-4 sm:gap-5">
          {leavesStats.map((item) => (
            <div key={item.label} className='card card-hover p-5 sm:p-6 relative overflow-hidden group flex items-center justify-between'>
              <div>
                <div className='absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70'/>
                <p className='text-sm font-medium text-slate-700'>{item.label}</p>
                <p className='text-2xl font-bold mt-1 text-slate-900'>{item.value} <span className="text-sm text-slate-500 font-light">taken</span></p>
              </div>
              <item.icon className="size-10 p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-200"/>
            </div>
          ))}
        </div>
      )}

      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fetchLeaveData}/>
      <ApplyLeaveModal open={showModal} onClose={()=>setShowModal(false)} onSuccess={fetchLeaveData}/>
    </div>
  )
}

export default Leave