import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"

import { useForm } from "react-hook-form"


const Chat = () => {

    const [user, setUser] = useState()

    const [chatIDState, setChatIDState] = useState()
    const [chatPartnerState, setChatPartnerState] = useState()

    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])
    const [chatLoaded, setChatLoaded] = useState(false)
    const navigate = useNavigate()


    //input handlen
    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    //Lädt die Chat Dateien
    const fetchChat = async (userData) => {

        try {
            const response = await fetch("http://localhost:4000/getChat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user: userData })
            })

            if (response.ok) {
                const data = await response.json()
                //console.log(data)
                setChats(data)
            }

            else {
                const data = await response.json()
                console.log("fehler", data)

            }
        }

        catch (error) {
            console.error(error)
        }




    }

    //Lädt die Nachtichten
    const loadChat = async (chatID, creator, partner) => {
        console.log("Chat loaded")
        console.log(chatID, creator, partner)
        setChatIDState(chatID)
        setChatPartnerState(partner)
        setChatLoaded(true)

        try {
            const response = await fetch("http://localhost:4000/loadChat", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ chatID: chatID })
            })

            if (response.ok) {
                const data = await response.json()
                console.log(data)
                setMessages(data)
            }
            else {
                const data = await response.json()
                console.log("Fehler aufgretreten", data)
            }
        }

        catch (error) {
            console.error("Fehler aufgetreten", error)
        }



    }

    const onSubmit = async (data) => {


        const chatid = chatIDState
        console.log(chatid)
        const message = data.newMessage
        const sender = user
        const status = "gesendet"
        const timestamp = new Date()
        const receiver = chatPartnerState

        const newMessageObject = {
            chatid: chatid,
            sender: sender,
            receiver: receiver,
            message: message,
            timestamp: timestamp,
            status: status
        }

        console.log(newMessageObject)

        try {
            const response = await fetch("http://localhost:4000/newMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ newMessage: newMessageObject })
            })

            if (response.ok) {
                const data = response.json()
                console.log("DATTTTTTAAAA", data)
                loadChat(chatid)
                
            }

            else {
                const data = response.json()
                console.log("Fehler aufgetreten", data)
            }

        }

        catch (error) {
            console.error("Fehler aufgetreten", error)
        }

    }



    useEffect(() => {
        const currentUser = localStorage.getItem("user")
        if (currentUser) {

            setUser(currentUser)


        }

        else {
            navigate("/login")
        }
    }, [])

    useEffect(() => {
        if (user) {
            //console.log("fetching")
            fetchChat(user)
        }
    }, [user])






    return (
        <div className="flex md:flex-row flex-col md:h-screen md:p-10">
            <Sidebar user={user} />

            <div className="w-screen md:w-1/6 overflow-scroll ">

                {chats && chats.map((item, index) => (
                    <div onClick={() => loadChat(item.chatid, item.creator, item.partner)} key={index} className="border border-lime-200 rounded-md text-center m-4 p-4">

                        {
                            item.creator == user ?
                                <p className="text-auto" >{item.partner}</p> :
                                <p className="text-auto" >{item.creator}</p>}

                    </div>

                ))}
                {chats.length == 0 && <div className="text-center m-4 p-4">Keine Chats verfügbar</div>}
            </div>

            <div className="w-screen md:w-4/6 flex flex-col justify-between border border-gray-200 m-2">
                <div className="bg-gray-200 p-4 m-2  ">{chatPartnerState}</div>
                <div className="h-4/6 overflow-scroll">

                    {messages && messages.map((item, index) => (
                        <div key={index}>

                            {
                                item.sender == user ?
                                    <div className="text-xl p-4 m-4 flex justify-end ">
                                        <p className="bg-lime-200 rounded-xl w-fit p-4 m-2">{item.message}</p>
                                    </div> :
                                    <div className="text-xl p-4 m-4 flex justify-start ">
                                        <p className="bg-lime-200 rounded-xl w-fit p-4 m-2">{item.message}</p>

                                    </div>

                            }



                        </div>
                    ))}
                </div>


                <div className="sticky bottom-0 left-0 right-0">

                    {chatLoaded > 0 &&

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row">
                            <input {...register("newMessage", {
                                required: true
                            })} className="m-4 w-5/6 p-4 rounded-lg border border-gray-200 focus:outline-none  focus:ring focus:ring-lime-200 " />
                            <button className="m-4 w-1/6 p-4 rounded-lg bg-lime-200">Send</button>
                        </form>
                    }

                </div>
            </div>


        </div>
    )
}

export default Chat