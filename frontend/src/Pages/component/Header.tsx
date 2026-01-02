import { AiOutlineLogout } from "react-icons/ai"
import { FcManager } from "react-icons/fc"
import { useAuth } from "../../context/auth.context"

const Header = () => {
    const {setUser} = useAuth();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null)
        window.location.href = '/auth/login'
    }
    
    return (
        <>
            <div className="flex h-15 w-[99%] bg-gray-100 shadow-xl items-center justify-center p-2 relative rounded-md">
                <FcManager className="text-4xl md:text-5xl"/>
                <AiOutlineLogout onClick={handleLogout} className="text-2xl md:text-3xl border-2 rounded-full text-blue-400 absolute right-5"/>
            </div>
        </>
    )
}

export default Header