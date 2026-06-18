import { useEffect, useState } from "react"
import Loading from "../components/Loading"
import EmployeeDashboard from "../components/EmployeeDashboard"
import AdminDashboard from "../components/AdminDashboard"
import axios from "axios"

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")
        
        if (!token || !storedUser) {
          setLoading(false)
          return
        }

        const userObj = JSON.parse(storedUser)
        // Convert to uppercase to cleanly support your sub-component's conditional check (data.role === "ADMIN")
        const currentRole = userObj.role?.toUpperCase() 

        // 1. Point our HTTP request to the corresponding backend collection endpoint
        const endpoint = currentRole === "ADMIN" 
          ? "http://localhost:5000/api/attendance/all" // Admins view all metrics
          : "http://localhost:5000/api/attendance/my-logs" // Employees view self metrics

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        // 2. Format the response object to match what your existing <AdminDashboard /> and <EmployeeDashboard /> sub-views expect
        setData({
          role: currentRole,
          rawLogs: response.data?.data || [],
          user: userObj
          // Note: When you pass this 'data' object forward, your sub-dashboards can map these live arrays directly!
        })

      } catch (error) {
        console.error("Dashboard metric collection error:", error)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) return <Loading />
  if (!data) return <p className="text-center py-12 text-slate-500">Failed to load dashboard</p>

  if (data.role === "ADMIN") {
    return <AdminDashboard data={data} />
  } else {
    return <EmployeeDashboard data={data} />
  }
}

export default Dashboard