import { useEffect, useState } from "react"
import Sidebar from "./Sidebar"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"

const Profile = () => {

    const [isEditing, setIsEditing] = useState(false)
    const { register, handleSubmit } = useForm()
    const [user, setUser] = useState()
    const [profile, setProfile] = useState()
    const navigate = useNavigate()
    const [suggestions, setSuggestions] = useState()

    const fetchProfile = async () => {
        try {
            const response = await fetch("http://localhost:4000/getProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: user })
            })

            if (response.ok) {
                const data = await response.json()
                // console.log(data.message)
                setProfile(data.message)
            }

            else {
                const error_data = await response.json()
                console.log(error_data.message)
            }
        }

        catch (error) {
            console.error("Fehler aufgetreten", error)
        }
    }

    const editProfile = () => {
        setIsEditing(true)
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
            console.log("loading")
            fetchProfile()
        }
    }, [user])

    const onSubmit = async (data) => {
        console.log(data)

        const newData = {...data, username: user}
        try {
            const response = await fetch("http://localhost:4000/editProfile", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(newData)
            })

            if(response.ok) {
                const data = await response.json()
                console.log(newData)
            }

            else {
                const error_data = await response.json()
                console.log(error_data)
            }
        }

        catch(error) {
            console.error("Ein Fehler ist aufgetreten", error)
        }


        fetchProfile() //damit die daten geladen werden
        setIsEditing(false)
    }

    return (
        <div className="flex md:flex-row flex-col md:h-screen md:p-10 ">
            <Sidebar user={user} />

            {/* Normale Ansicht */}

            {!isEditing && <div className="w-screen md:w-5/6 flex justify-center">
                {profile && profile.map((item, index) => (
                    <div className="rounded-lg border border-gray-200 shadow-md w-4/6" key={index}>
                        <div className="h-2/5 flex ">
                            <img className="object-cover w-1/2 m-4 rounded-lg" src={item.profile_img} alt="profile_img" />
                            <p className="w-1/2 flex justify-center items-center text-5xl"> {item.username}</p>
                        </div>
                        <div className="h-3/5 flex flex-col items-center ">
                            <p className="text-2xl p-4">Vorname: {item.first_name}</p>
                            <p className="text-2xl p-4">Nachname: {item.last_name}</p>
                            <p className="text-2xl p-4">Alter: {item.age}</p>
                            <button onClick={editProfile} className="bg-lime-200 p-4 m-4 w-1/3 rounded-lg hover:shadow-md">Profil bearbeiten</button>
                        </div>

                    </div>
                ))}
            </div>}

            {/* Bearbeitung Ansicht */}
            {isEditing && <div className="w-screen md:w-5/6 flex justify-center">
                <div className="rounded-lg border border-gray-200 shadow-md w-4/6 flex justify-center" >

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-3/4">
                        <p className="text-2xl">Edit profile</p>
                        <p className="text-red-400"></p>
                        <input {...register("first_name")} defaultValue={profile[0].first_name} type="text" placeholder="Vorname" className="m-4 p-4 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring focus:ring-lime-200 " />
                        <input {...register("last_name")} defaultValue={profile[0].last_name} type="text" placeholder="Nachname" className="m-4 w-full p-4 rounded-lg border border-gray-200 focus:outline-none  focus:ring focus:ring-lime-200 " />
                        <input {...register("age")} defaultValue={profile[0].age} type="text" placeholder="Alter" className="m-4 w-full p-4 rounded-lg border border-gray-200 focus:outline-none  focus:ring focus:ring-lime-200 " />
                        <input {...register("profile_img")} defaultValue={profile[0].profile_img} type="text" placeholder="Profilbild-link" className="m-4 w-full p-4 rounded-lg border border-gray-200 focus:outline-none  focus:ring focus:ring-lime-200 " />

                        <button className="bg-lime-200 p-4 m-4 w-1/3 rounded-lg hover:shadow-md" type="submit">Save</button>
                    </form>

                </div>
            </div>}

        </div>
    )
}

export default Profile