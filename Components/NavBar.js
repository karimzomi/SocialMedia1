import { useEffect } from 'react'
import Style from '../styles/Nav.module.css'
import Link from 'next/link'

export default function NavBar(props){
    useEffect(()=>{

    },[])
 return(
     <nav className={Style.Nav_Container}>
         <ul>
             <li><Link href="/">Home</Link></li>
             <li><Link href="/Chat">Chat</Link></li>
             <li><Link href="/">test</Link></li>
         </ul>
     </nav>

 )
}