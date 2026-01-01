import { Button, Input, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { RegisterDTO, Role, type registerProps } from "../auth.config";
import { yupResolver } from "@hookform/resolvers/yup";
import authSvc from "../../../service/auth.service";
import { useNavigate } from "react-router-dom";

const AuthLayout = () => {
    const navigate = useNavigate();

    const { control, handleSubmit, formState: { errors } } = useForm({
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
            navigate('/home')
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    return (
        <>
            <div className="flex flex-col gap-2">
                <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-2">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Enter your name"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Enter your email"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input.Password
                                {...field}
                                placeholder="Enter your password"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        )}
                    />
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                defaultValue={Role.USER}
                                allowClear
                                options={[
                                    {value: Role.ADMIN, label: `${Role.ADMIN}`},
                                    {value: Role.USER, label: `${Role.USER}`},
                                ]}
                            />
                        )}
                    />

                    <Button type="primary" htmlType="submit" size="large">Register</Button>
                </form>
            </div>
        </>
    )
}

export default AuthLayout;