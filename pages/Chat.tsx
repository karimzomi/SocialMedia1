import axios from "axios";
import { useState, ReactElement, useEffect, useRef } from 'react'
import Style from '../styles/Chat.module.css'
import useSWR, { mutate } from 'swr'
import Input from '../Components/Input'
interface Msg {
    user_id: String,
    content: String,
    created_at: Date,
    id: string
}
function SendMessage(Message: String, Convid: String) {
    return axios.post("/api/Chat/SendMessageP", { Message, Convid }).then((data)=>{return data})
}
function GetMessage(URL: string) {
    return axios.get(URL).then((res) => res.data).catch(err => err);

}
function RenderMessages(M: Array<Msg>, id: String) {
    let user = 0
    let nuser = 0
    let res: Array<ReactElement> = []

    for (let i = 0; i < M.length; i++) {
        const element = M[i];
        if (element.user_id === id && user === 0) {
            user++
            nuser = 0
            res.push(
                <div key={i} className={Style.Message_Sent}>
                    {[<p key={element.id} className={Style.Message}>
                        {element.content}
                    </p>]}
                </div>
            )
        } else if (element.user_id === id && user === 1) {
            res[res.length - 1].props.children.push(
                <p key={element.id} className={Style.Message}>
                    {element.content}
                </p>
            );
        }
        else if (element.user_id !== id && nuser === 0) {
            nuser++
            user = 0
            res.push(
                <div key={i} className={Style.Message_Received}>
                    {[<p key={element.id} className={Style.Message}>
                        {element.content}
                    </p>]}
                </div>
            )
        } else {
            res[res.length - 1].props.children.push(
                <p key={element.id} className={Style.Message}>
                    {element.content}
                </p>
            );
        }
    }

    return res;
}
function ScrollDown(index) {
    const element = document.querySelector('#messages_container'+index)
    if (element) {        
        element.scroll(0, element.scrollHeight)
    }
}
export default function Chat({ ReceiverId,index }) {
    const [message, setmessage] = useState('')
    const refs = useRef(null)
    const [ConversationId, setConversationId] = useState(null)
    const [id, setid] = useState(null)
    useEffect(() => {
        async function fetchConvId() {
            await axios.post("/api/Chat/getConv", { ReceiverId })
                .then((res) => {
                    setConversationId(res.data.ConvId)
                    setid(res.data.Id)
                })
        }
        fetchConvId()
    }, [])
    const { data, error } = useSWR(`/api/Chat/${ConversationId}`, GetMessage, { refreshInterval: 3000, refreshWhenHidden: true })
    useEffect(() => {
        ScrollDown(index)
        const msg = document.querySelectorAll("." + Style.Message_Sent)
        const msg2 = document.querySelectorAll("." + Style.Message_Received)

        msg.forEach((element) => {
            if (element.childElementCount > 1) element.classList.add(Style.Message_Sent_Round)
        })

        msg2.forEach((element) => {
            if (element.childElementCount > 1) element.classList.add(Style.Message_Received_Round)

        })
    }, [data,])
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    else {
        return (
            <div onClick={() => { refs.current.focus() }} className={Style.ChatBox_container}>
                <div className={Style.Messages_container} id={"messages_container"+index}>
                    {RenderMessages(data, id)}
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault()
                    if (message.length !== 0) {
                        setmessage('')                        
                        mutate(`/api/Chat/${ConversationId}`, [...data, { user_id: id, content: message }], false)
                        SendMessage(message, ConversationId)
                    }
                }
                }>
                    <Input value={message} onChange={setmessage} ref={refs} />
                    <button type="submit">Send</button>
                </form>
            </div >

        )
    }
}

