import { useEffect, useState } from "react"
import Sidebar from "./Sidebar"
import { useNavigate } from "react-router-dom"

const Discover = () => {

    const [user, setUser] = useState()
    const navigate = useNavigate()
    const [suggestions, setSuggestions] = useState([])

    const [alreadyChatting, setAllreadyChatting] = useState()
    const [pag, setPag] = useState(4)
    //alle user anzeigen

    const fetchUsers = async () => {
        try {
            const response = await fetch("https://chatapp-79dt.onrender.com/discover", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({user: localStorage.getItem("user")})
            })

            if (response.ok) {
                const data = await response.json()
                console.log(data.alreadyChatting)
                setAllreadyChatting(data.alreadyChatting)

                
                // Dieser Teil macht folgendes: Die Daten werden auf 9 teile geteilt (mit pagination)
                // danach werden die jenigen rausgefitlert mit der schon ein chat besteht(daten aus backend)
                

                const paginationResponse = data.message.slice(0, pag)
                const discoverWithoutPartner = paginationResponse.filter(item => !data.alreadyChatting.includes(item.username))
                console.log(discoverWithoutPartner)

                setSuggestions(discoverWithoutPartner)
            }

            else {
                const error_data = await response.json()
                console.log(error_data)
            }
        }

        catch (error) {
            console.log("Fetch failed", error)
        }
    }

    const startChatting = async (data) => {
        console.log("CHAT PARTNER:",data.username)
        console.log("CHAT CREATOR", user)

        try {
            const response = await fetch("https://chatapp-79dt.onrender.com/startChat", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({creator: user, partner: data.username})
            })

            if(response.ok) {
                const data = await response.json()
                console.log(data)
                setTimeout( ()=> {
                    navigate("/ ")
                },400 )
            }
            else {
                const error_data = await response.json()
                console.log("error:", error_data)
            }
        }

        catch(error) {
            console.error("Fehler aufgetreten", error)
        }
    }


    useEffect(() => {
        const currentUser = localStorage.getItem("user")
        if (currentUser) {

            setUser(currentUser)
            fetchUsers()


        }

        else {
            navigate("/login")
        }
    },[pag])

    const showMore = () => {
        console.log(pag)
        setPag(pag + 4)
    }

    return (
        <div className="flex md:flex-row flex-col md:h-screen md:p-10">
            <Sidebar user={user} />

            <div className="w-screen md:w-5/6 p-4 m-4 max-h-100 overflow-scroll flex flex-col items-center">


                {/* Vorschläge werden angezeigt mit Link yu neuen Chat */}
                {suggestions && suggestions.map((item, index) => (
                    
                    <div className="p-2 m-2 w-1/2 border rounded-md shadow-md" key={index}>
                        <div className="flex justify-center items-center">
                            <div className="w-1/2">
                                <img className="object-fit rounded-xl" src={item.profile_img} alt="profile_img" />
                            </div>
                            <div className="w-1/2 text-center">
                                <p>{item.username}</p>
                                <button onClick={()=>startChatting(item)} className="bg-lime-200 p-2 m-2 rounded-lg hover:shadow-md" type="submit">Chat starten</button>
                            </div>
                        </div>
                        
                    </div>

                ))}

                {suggestions.length == 0 && 
                <div>
                    Keine Empfehlungen verfügbar
                    </div>}

                {suggestions.length > 0 && <div onClick={showMore} className="cursor-pointer">Mehr anzeigen</div>}
            </div>
            
        </div>


    )
}

export default Discover