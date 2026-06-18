import { useCallback, useEffect, useState } from "react"
import { dummyAttendanceData } from "../assets/dummyData"
import Loading from "../components/Loading"
import CheckInButton from "../components/attendance/CheckInButton"
import AttendanceStats from "../components/attendance/AttendanceStats"
import AttendanceHistory from "../components/attendance/AttendanceHistory"
import axios from 'axios'

const Attendence = () => {

  const [history,setHistory] = useState([])
  const [loading,setLoading] = useState(true)
  const [isDeleted,setIsDeleted] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      if (storedUser) {
        const userObj = JSON.parse(storedUser)
        // Check if employee record is marked as suspended/inactive
        if (userObj.status === "inactive" || userObj.isDeleted === true) {
          setIsDeleted(true)
        }
      }

      const response = await axios.get("http://localhost:5000/api/attendance/my-logs", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // Set history array from response payload
      setHistory(response.data?.data || [])
    } catch (error) {
      console.error("Failed to collect live attendance data history:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(()=>{
    fetchData()
  },[fetchData])

  if(loading) return <Loading/>

  const today = new Date ();
  today.setHours(0,0,0,0)
  const todayRecord = history.find((r)=> new Date(r.date).toDateString() === today.toDateString())

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">Track your work hours and daily check</p>
      </div>

      {isDeleted ? (
        <div className="mb-8 p-6 bg-rose-500 border border-rose-200 text-center rounded-2xl">
          <p className="text-rose-500">You can no longer clock in or out because your employee records have been marked as deleted</p>
        </div>
      ): (
        <div className="mb-8">
          <CheckInButton todayRecord={todayRecord} onAction={fetchData}/>
        </div>
      )}

      <AttendanceStats history={history}/>
      <AttendanceHistory history={history}/>

    </div>
  )
}

export default Attendence