import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth.context"
import { useEffect, useState } from "react";
import { FcManager } from "react-icons/fc";

const PageLayout = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/user')
            }
        } else {
            navigate('/auth/login')
        }
        setIsLoading(false)
    }, [user, navigate])

    return (
        isLoading ?
        <div className="flex w-full h-screen items-center justify-center">
            <FcManager className="text-4xl md:text-5xl animate-pulse"/>
        </div>
        :
        <div className="flex w-full h-full items-center justify-center">
            <Outlet />
        </div>
    )
}

export default PageLayout
