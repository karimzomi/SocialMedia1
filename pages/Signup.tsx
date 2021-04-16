import Head from 'next/head'
import styles from '../styles/Register.module.css'
import { useState, useEffect } from 'react'
import Input from '../Components/Input'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'


export default function SignUp({ data }) {

  const router = useRouter()
  const [Name, setName] = useState("")
  const [Password, setPassword] = useState("")
  const [verifie_Password, setverifie_Password] = useState("")
  const [Email, setEmail] = useState("")
  async function SendInfo(e) {
    e.preventDefault()
    await axios.post("/api/Sign_Up", {
      Name,
      Password,
      email: Email
    }).then((res) => router.push("/"))
  }
  useEffect(() => {    
    if (data.UserStatus === "Authorized") {
      router.push("/")
    }
  }, [data])
  useEffect(() => {
    const INP = document.getElementById('Verifie password').parentElement
    if (Password !== verifie_Password) {
      INP.classList.add(styles.Wrong)
    }
    else {
      INP.classList.remove(styles.Wrong)
    }
  }, [verifie_Password, Password])

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </Head>
      <form method="POST" onSubmit={SendInfo} className={styles.Form_container} autoComplete={'off'}>
        <span></span>
        <h1>Sign up</h1>
        <Input type="text" Label="UserName" value={Name} onChange={setName} Icon="account_circle" />
        <Input type="Email" Label="Email" value={Email} onChange={setEmail} Icon="mail" />
        <Input type="Password" Label="Password" value={Password} onChange={setPassword} Icon="lock" />
        <Input type="Password" Label="Verifie password" value={verifie_Password} onChange={setverifie_Password} Icon="lock" />
        <div className={styles.button}>
          <button type="submit" >Sign Up</button>
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

