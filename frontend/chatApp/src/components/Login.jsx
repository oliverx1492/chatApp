import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"


const Login = () => {

    const navigate = useNavigate()
    const { register, handleSubmit } = useForm()
    const [message, setMessage] = useState()

    const onSubmit = async (data) => {
        console.log(data.username)

        try {
            const response = await fetch("https://chatapp-79dt.onrender.com/login", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(data)
            })

            if(response.ok) {
                const responseData = await response.json()
                console.log(responseData)
                setMessage(responseData.message)
                localStorage.setItem("login", "true")
                
                localStorage.setItem("user", data.username)
                navigate("/")
            }

            else {
                const data = await response.json()
                console.log("error", data)
                setMessage(data.message)
            }
        }

        catch(error) {
            console.log(error)
        }
    }

    return (
        <div className="text-center h-screen flex justify-center items-center ">
            <div className="shadow-2xl w-full  md:w-1/3 h-3/4 rounded-lg border border-gray-200">
                
                <div className="flex justify-center items-center  h-full">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-3/4">
                        <p className="text-2xl">Login</p>
                        <p className="text-red-400">{message}</p>
                        <input {...register("username")} type="text" placeholder="Username" className="m-4 p-4 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring focus:ring-lime-200 " />
                        <input {...register("password")} type="password" placeholder="Password" className="m-4 w-full p-4 rounded-lg border border-gray-200 focus:outline-none  focus:ring focus:ring-lime-200 " />
                        <button className="bg-lime-200 p-4 m-4 w-1/3 rounded-lg hover:shadow-md" type="submit">Login</button>
                        <Link to="/signup"><p className="text-sm cursor-pointer">Kein Account? Jetzt registrieren!</p></Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login