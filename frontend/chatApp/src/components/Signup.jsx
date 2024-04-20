import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"


const Signup = () => {

    const { register, handleSubmit, watch, formState: {errors} } = useForm()
    const [message, setMessage] = useState()
    const navigate = useNavigate()
    
    const onSubmit = async (data) => {
        console.log(data)

        try {
            const response = await fetch("http://localhost:4000/signup", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(data)
            })

            if(response.ok) {
                const data = await response.json()
                console.log(data)
                setMessage(data.message)
                setTimeout( ()=> {
                    navigate("/login")
                },2000 )
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
                        <p className="text-2xl">Konto erstellen</p>
                        <p className="text-red-400">{message}</p>
                        <input {...register("username")} type="text" placeholder="Username" className="m-4 p-4 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring focus:ring-lime-200 " />
                        <input {...register("password")} type="password" placeholder="Password" className="m-4 w-full p-4 rounded-lg border border-gray-200 focus:outline-none  focus:ring focus:ring-lime-200 " />
                        <input {...register("repeat_password", {
                            validate: value => value === watch("password") || "Passwords do not match"
                        })} type="password" placeholder="Repeat Password" className="m-4 w-full p-4 rounded-lg border border-gray-200 focus:outline-none  focus:ring focus:ring-lime-200 " />
                       
                        {errors.repeat_password && <p className="text-red-400">{errors.repeat_password.message}</p>}
                       
                        <button className="bg-lime-200 p-4 m-4 w-1/3 rounded-lg hover:shadow-md" type="submit">Registrieren</button>
                        <Link to="/login"><p className="text-sm cursor-pointer">Du hast schon einen Account? Melde dich an</p></Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup