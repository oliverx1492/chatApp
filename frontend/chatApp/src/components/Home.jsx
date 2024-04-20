import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Chat from "./Chat"
import Sidebar from "./Sidebar"


const Home = () => {

    const navigate = useNavigate()

    useEffect( ()=> {

        // Beim Login werde ich ein wert (true) ins local storage speichern, um zu überprüfen ob ein user angemeldet ist
        const userdata = localStorage.getItem("login")

        if(!userdata) {
            navigate("/login")
        }
    } )


    //andere Tabellen zum erstellen (cahtgpt)
    //chat (id, teilnehmer)
    //nachrichten(id, sender, empfänger,chatid,status,zeitstempel)

    return (
        <div className="flex md:flex-row flex-col md:h-screen md:p-10">
            <Sidebar />
           
        </div>
    )
}


export default Home