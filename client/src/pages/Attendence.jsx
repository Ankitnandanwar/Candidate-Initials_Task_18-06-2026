import { useCallback, useEffect, useState } from "react"
import { dummyAttendanceData } from "../assets/dummyData"
import Loading from "../components/Loading"
import CheckInButton from "../components/attendance/CheckInButton"
import AttendanceStats from "../components/attendance/AttendanceStats"
import AttendanceHistory from "../components/attendance/AttendanceHistory"

const Attendence = () => {

  const [history,setHistory] = useState([])
  const [loading,setLoading] = useState(true)
  const [isDeleted,setIsDeleted] = useState(false)

  const fetchData = useCallback(async() =>{
    setHistory(dummyAttendanceData)
    setTimeout(()=>{
      setLoading(false)
    },1000)
  },[])

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