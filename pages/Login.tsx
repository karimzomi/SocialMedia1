import Head from 'next/head'
import styles from '../styles/Register.module.css'
import { useState, useEffect } from 'react'
import Input from '../Components/Input'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import {useRouter } from 'next/router'



export default function Login({data}) {
  const router = useRouter()
  const SendInfo = (e)=> {
    axios.post("/api/Log_in", {
      email: Email,
      Password,
    }).then((res) => {
      router.push("/")
    })
      .catch((err) => {
        if (err.status === 400) {
  
        }
      })
      e.preventDefault()
  }
  useEffect(() => {    
    if (data.UserStatus === "Authorized") {
      router.push("/")
    }
  }, [data])

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </Head>
      <form method="POST" onSubmit={SendInfo} className={styles.Form_container} autoComplete={'off'}>
        <span></span>
        <h1>Log in</h1>
        <Input type="Email" Label="Email" value={Email} onChange={setEmail} Icon="mail" />
        <Input type="Password" Label="Password" value={Password} onChange={setPassword} Icon="lock" />
        <div className={styles.button}>
          <button type="submit" >Log In</button>
        </div>
      </form>
  </>
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.headers.cookie
  const res = await axios.post("http://localhost:3000/api/Auth/TokenCheck",{
  },{headers:{
    cookie:cookie?cookie:null
  }
  }).then((res) => {
    return res.data.UserStatus
  })
  .catch((err)=>{
    return err.response.data.UserStatus
  })  
  console.log(res);
  
  return {
    props: {
      data: {
        UserStatus:res
      }
    }
  }
}