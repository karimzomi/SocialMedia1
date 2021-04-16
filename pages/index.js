import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import ChatComponent from './Chat'

function AuthCheckRequest(URL) {
  return axios.post(URL).then((res) => {
    return res.data.UserStatus
  })
}
export default function Home() {
  const [Users, setUsers] = useState([])
  const [Chat, setChat] = useState()
  const { data, error } = useSWR(`/api/Auth/TokenCheckP`, AuthCheckRequest, { refreshInterval: 5000 })

  if (error) {
    return <h1>Error!</h1>
  }
  if (!data) {
    return <h1>Loading</h1>
  }
  if (data === "Authorized") {
    return (
      <>
        <div className={styles.container}>
          {data}
          <button onClick={() => { axios.post("/api/LogOut").then((res) => { }) }}>Press Me</button>
          <button onClick={() => {
            axios.get("/api/User").then((res) => {
              {
                setUsers(res.data)
              }
            })
          }}>Users</button>
          {Users.map((user) => {
            return <button key={user.id} onClick={() => {
              if (!Chat) return setChat(<ChatComponent ReceiverId={user.id} />)
              console.log(Chat);
              return setChat(null)
            }}>{user.username}</button>
          })}
          {/* <div style={{display:'flex',flexWrap:"wrap",justifyContent:"space-around"}}>
          {Users.map((user,i) => {
            return <div style={{display:'flex',flexDirection:"column"}}>
            <h1>{user.username}</h1>
            <ChatComponent ReceiverId={user.id} index={i} /></div>
          })}
          </div> */}

          <div>
            {Chat}
          </div>
        </div>
      </>

    )
  }
}
