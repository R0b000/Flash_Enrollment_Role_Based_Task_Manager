import { Button, Divider, Input, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { LoginDTO, type loginProps } from "./auth.config";
import { yupResolver } from "@hookform/resolvers/yup";
import authSvc from "../../service/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";

const Login = () => {
    const navigate = useNavigate();
    const {setUser} = useAuth()

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            email: '@test.com',
            password: `bcrypt('password')`,
        },
        resolver: yupResolver(LoginDTO)
    })

    const submitForm = async (data: loginProps) => {
        try {
            const response = await authSvc.login(data);
            if(response.user.role === 'admin'){
                navigate('/admin')
                setUser(response.user)
            } else if (response.user.role === 'user') {
                navigate('/user')
                setUser(response.user)
            }
        } catch (error) {
            console.log( error)
            //@ts-ignore
            if(error?.response?.status === 401) {
                message.error(`Credential doesn't match`)
            }
            throw error
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit(submitForm)} className="flex flex-col w-full h-full">
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <>
                            <span className="text-gray-700 text-sm">Enter your email.</span>
                            <div className="flex flex-col relative w-full h-13">
                                <Input
                                    {...field}
                                    placeholder="Enter your email"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                                {errors.email?.message &&
                                    <span className="absolute bottom-0 text-sm text-red-400">
                                        {errors.email.message}
                                    </span>
                                }
                            </div>
                        </>
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <>
                            <span className="text-gray-700 text-sm">Enter your password.</span>
                            <div className="flex flex-col h-13 relative w-full">
                                <Input.Password
                                    {...field}
                                    placeholder="Enter your password"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                                {errors.password?.message &&
                                    <span className="absolute bottom-0 text-sm text-red-400">
                                        {errors.password.message}
                                    </span>
                                }
                            </div>
                        </>
                    )}
                />
                <div className="flex w-full h-full items-center justify-center">
                    {isSubmitting ?
                        <Button type="primary" loading className="mt-10 w-[90%] gap-2" size="large">Login</Button>
                        :
                        <Button type="primary" className="mt-10 w-[90%]" htmlType="submit" size="large">Login</Button>
                    }
                </div>
            </form>
            <Divider />
            <span className="flex w-full h-auto p-2 gap-2 items-center justify-center">
                <p>Doesn't have an account yet?</p>
                <a className="underline flex text-blue-400" href="register">
                    Register
                </a>
            </span>
        </>
    )
}

export default Login