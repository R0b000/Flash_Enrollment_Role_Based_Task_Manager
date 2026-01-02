import { Button, Divider, Input, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { RegisterDTO, Role, type registerProps } from "./auth.config";
import { yupResolver } from "@hookform/resolvers/yup";
import authSvc from "../../service/auth.service";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            name: '',
            email: '@test.com',
            password: `bcrypt('password')`,
            role: Role.USER
        },
        resolver: yupResolver(RegisterDTO)
    })

    const submitForm = async (data: registerProps) => {
        try {
            await authSvc.register(data);
            navigate('/auth/login')
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit(submitForm)} className="flex flex-col w-full h-full">
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <>
                            <span className="text-gray-700 text-sm">Enter your name.</span>
                            <div className="flex flex-col relative w-full h-13">
                                <Input
                                    {...field}
                                    placeholder="Enter your name"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                                {errors.name?.message &&
                                    <span className="absolute bottom-0 text-sm text-red-400">
                                        {errors.name.message}
                                    </span>
                                }
                            </div>
                        </>
                    )}
                />
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
                            <div className="flex flex-col h-13 relative">
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
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <>
                            <span className="text-gray-700 text-sm">Select your role.</span>
                            <Select
                                {...field}
                                defaultValue={Role.USER}
                                allowClear
                                options={[
                                    { value: Role.ADMIN, label: `${Role.ADMIN}` },
                                    { value: Role.USER, label: `${Role.USER}` },
                                ]}
                            />
                        </>
                    )}
                />

                <div className="flex w-full h-full items-center justify-center">
                    {isSubmitting ?
                        <Button type="primary" loading className="mt-10 w-[90%] gap-2" size="large">Register</Button>
                        :
                        <Button type="primary" className="mt-10 w-[90%]" htmlType="submit" size="large">Register</Button>
                    }
                </div>
            </form>
            <Divider />
            <span className="flex w-full h-auto p-2 gap-2 items-center justify-center">
                <p>Already have an account?</p>
                <a className="underline flex text-blue-400" href="login">
                    Login
                </a>
            </span>
        </>
    )
}

export default Register