import { useNavigate } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Input, Modal, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { createTaskDTO, type createTaskProps } from "../task.config";
import { yupResolver } from "@hookform/resolvers/yup";
import TextArea from "antd/es/input/TextArea";
import taskSvc from "../../../service/task.service";
import TaskPage from "../TaskPage";
import { useAuth } from "../../../context/auth.context";

const TaskLayout = () => {
    const [createClick, setCreateClick] = useState<boolean>(false);
    const navigate = useNavigate();
    const {user} = useAuth();

    useEffect(() => {
        if(user?.role === 'admin') {
            navigate('/admin')
        } else {
            navigate('/user')
        }
    }, [])

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<createTaskProps>({
        defaultValues: {
            title: "",
            description: "",
        },
        resolver: yupResolver(createTaskDTO) as any,
    });

    const submitForm = async (data: createTaskProps) => {
        try {
            await taskSvc.create(data);
            setCreateClick(false);
            reset();
            navigate('?submit=true')
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col min-h-svh justify-between">
            <div className="flex flex-col w-full h-full p-2 gap-2">
                <Header />
                <div className="flex gap-2 w-full h-auto items-center justify-between p-2 px-10">
                    <p className="flex font-semibold text-lg">Tasks</p>
                    <div className="flex h-full items-center ">
                        CREATE -
                        <RiStickyNoteAddFill
                            onClick={() => setCreateClick(true)}
                            className="text-3xl md:text-4xl text-teal-500 hover:scale-105 cursor-pointer"
                        />
                    </div>
                </div>
                <TaskPage />
            </div>

            <Footer />

            <Modal
                title="Create Task"
                open={createClick}
                onCancel={() => setCreateClick(false)}
                footer={null}
            >
                <form
                    onSubmit={handleSubmit(submitForm)}
                    className="flex flex-col gap-4"
                >
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <div className="flex flex-col relative w-full">
                                <span className="text-gray-700 text-sm mb-1">Enter your title</span>
                                <Input {...field} placeholder="Enter your title" />
                                {errors.title?.message && (
                                    <span className="text-sm text-red-500 mt-1">
                                        {errors.title.message}
                                    </span>
                                )}
                            </div>
                        )}
                    />
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <div className="flex flex-col relative w-full">
                                <span className="text-gray-700 text-sm mb-1">
                                    Enter your description
                                </span>
                                <TextArea {...field} maxLength={500} placeholder="Enter your description" style={{ height: '200px', resize: 'none' }} />
                                {errors.description?.message && (
                                    <span className="text-sm text-red-500 mt-1">
                                        {errors.description.message}
                                    </span>
                                )}
                            </div>
                        )}
                    />
                    <Button
                        htmlType="submit"
                        type="primary"
                        loading={isSubmitting}
                        className="mt-4"
                    >
                        Create
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default TaskLayout;
