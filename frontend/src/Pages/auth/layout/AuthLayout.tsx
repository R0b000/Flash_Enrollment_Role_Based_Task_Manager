
import { Outlet, useNavigate } from "react-router-dom";
import { FcManager } from "react-icons/fc";
import { Divider } from "antd";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth.context";

const AuthLayout = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(user) {
            if(user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/user')
            }
        } else {
            setIsLoading(false)
        }

    }, [user, navigate])

    return (
        <>
        {
            !isLoading &&
            <div className="flex w-screen h-svh items-center justify-center overflow-x-clip">
                <div className="flex flex-col min-w-xs md:min-w-sm items-center justify-center p-4 rounded-md bg-gray-100 shadow-xl">
                    <FcManager className="text-4xl md:text-5xl" />
                    <Divider />
                    <Outlet/>
                </div>
            </div>
        }
        </>
    )
}

export default AuthLayout;