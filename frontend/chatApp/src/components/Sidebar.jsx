import { Link, useNavigate } from "react-router-dom"


const Sidebar = (props) => {


    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("login")
        localStorage.removeItem("user")
        navigate("/login")
    }

    return (
        <div className="w-screen md:w-1/6 rounded-md bg-lime-200 text-center h-auto md:flex  md:flex-col md:justify-between ">

            <div className="">
                <Link to="/"><p className="md:p-4">Chats</p></Link>
                <Link to="/discover"><p className="md:p-4">Entdecken</p></Link>
            </div>
            <div>
                
                <Link to="/profile"><p className="md:p-4"> {props.user} </p></Link>
                <p onClick={logout} className="md:p-4 cursor-pointer" >Abmelden</p>
            </div>
        </div>
    )
}

export default Sidebar