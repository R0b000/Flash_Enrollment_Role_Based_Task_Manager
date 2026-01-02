import { useCallback, useEffect, useState } from "react"
import taskSvc from "../../service/task.service"
import { Button, Checkbox, Empty, Input, Modal, Pagination, Select } from "antd"
import type { CheckboxProps } from 'antd';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEyeInvisible } from "react-icons/ai";
import { createTaskDTO, type createTaskProps, type userDataProps } from "./task.config";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import TextArea from "antd/es/input/TextArea";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../context/auth.context";
import authSvc from "../../service/auth.service";

const onChange: CheckboxProps['onChange'] = (e) => {
    console.log(e.target.checked)
};

const TaskPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [userData, setUserData] = useState<userDataProps | null>(null)
    const [clickedId, setClickedId] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const submitted = searchParams.get('submit')
    const editId = searchParams.get('id')
    const [createClick, setCreateClick] = useState<boolean>(false);
    const [seeClick, setSeeClick] = useState<boolean>(false)
    const [userIdName, setUserIdName] = useState<any>(null);
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const { user } = useAuth();

    console.log(user)

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
            if (editId) {
                await taskSvc.update(editId, data as any);
                navigate('?submit=false')
                setCreateClick(false);
                reset();
                navigate('?submit=true')
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUserData = useCallback(async (page: number | 1) => {
        try {
            const response = await taskSvc.list(page, null)
            setUserData(response)
            setPagination({
                current: response.data.current_page,
                pageSize: response.data.per_page,
                total: response.data.total,
            })
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }, [])

    const handleCheckBoxClick = async (e: any, id: string) => {
        e.stopPropagation();

        const completedValue = e.target.checked ? 1 : 0;
        await taskSvc.update(id, { completed: completedValue } as any);

        fetchUserData(pagination.current);
    };


    const handleEditClick = (data: any) => {
        reset({
            title: data.title,
            description: data.description
        })
        setSeeClick(false);
        setCreateClick(true)
        navigate(`?id=${data.id}`)
    }

    const handleDeleteClick = async (id: string) => {
        await taskSvc.delete(id)
        fetchUserData(pagination.current);
    }

    const handleSeeClick = async (data: any) => {
        reset({
            title: data.title,
            description: data.description
        })
        setCreateClick(true)
        setSeeClick(true)
    }

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, current: page }));
        fetchUserData(page);
    };

    useEffect(() => {
        fetchUserData(pagination.current);
    }, []);

    useEffect(() => {
        if (submitted) {
            fetchUserData(pagination.current);
            navigate('?submit=false')
        }
    }, [pagination.current, submitted])

    useEffect(() => {
        const fetchUsers = async () => {
            if (user?.role === 'admin') {
                try {
                    const res = await authSvc.allUsers();
                    setUserIdName(res);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchUsers();
    }, [user]);

    let userArr = []

    if (userIdName) {
        //@ts-ignore
        userArr = userIdName.users.map(items => {
            return {
                value: items.id,
                label: items.name
            }
        })
    }

    const filterUsers = useCallback(async (id: string) => {
        try {
            const response = await taskSvc.list(pagination.current, id)
            setUserData(response)
            setPagination({
                current: response.data.current_page,
                pageSize: response.data.per_page,
                total: response.data.total,
            })
        } catch (error) {
            throw error
        }
    }, [])

    return (
        <>
            {!isLoading &&
                <div className="flex flex-col w-full h-full justify-center items-center">
                    {user?.role === 'admin' &&
                        <>
                            <div className="flex gap-5">
                                Filter by User
                                <Select
                                    options={userArr}
                                    placeholder="Select a user"
                                    style={{ width: 200 }}
                                    onChange={filterUsers}
                                    allowClear
                                />
                            </div>
                        </>
                    }
                    <div className="flex flex-col w-full h-full items-center justify-between gap-2 md:w-[80%]">
                        {userData?.data?.data && userData.data.data.length > 0 ?
                            (userData.data.data.map((items, index) => (
                                <div key={index} className="flex flex-col w-full h-full">
                                    <div onClick={(e) => {
                                        e.stopPropagation();
                                        setClickedId(prev => prev === items.id ? null : items.id);
                                    }} className={`flex flex-col w-full h-auto gap-2 p-2 shadow-lg rounded-md`}>
                                        <div className="flex gap-2 w-full h-full items-center justify-center p-2">
                                            <Checkbox
                                                checked={items.completed === 1} // convert 1/0 to boolean
                                                onChange={onChange}
                                                onClick={(e) => handleCheckBoxClick(e, items.id)}
                                            />
                                            <p className="flex gap-1 text-gray-400">::</p>
                                            <p className="w-full overflow-x-clip text-gray-700">
                                                {items.title}
                                            </p>
                                        </div>
                                        {clickedId === items.id &&
                                            <>
                                                <span className="flex grow w-full border border-gray-300"></span>
                                                <span className="flex gap-2 w-full p-2">
                                                    <span onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSeeClick(items)
                                                    }} className="flex gap-2 w-full h-auto items-center justify-center cursor-pointer">
                                                        <AiOutlineEyeInvisible className="text-2xl text-teal-400" />
                                                        See
                                                    </span>
                                                    <span onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditClick(items)
                                                    }} className="flex gap-2 w-full h-auto items-center justify-center cursor-pointer">
                                                        <AiOutlineEdit className="text-2xl text-teal-400" />
                                                        Edit
                                                    </span>
                                                    <span onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(items.id)
                                                    }} className="flex gap-2 w-full h-auto items-center justify-center cursor-pointer">
                                                        <AiOutlineDelete className="text-2xl text-red-500" />
                                                        Delete
                                                    </span>
                                                </span>
                                            </>
                                        }
                                    </div>
                                </div>
                            )))
                            :
                            <div>
                                <Empty />
                            </div>
                        }
                        <Pagination
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            total={pagination.total}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>

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
                                        <Input {...field} disabled={seeClick} placeholder="Enter your title" />
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
                            {seeClick &&
                                <Button
                                    type="primary"
                                    className="mt-4"
                                    onClick={() => setCreateClick(false)}
                                >
                                    Cancel
                                </Button>
                            }
                            {!seeClick &&
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    loading={isSubmitting}
                                    className="mt-4"
                                >
                                    Update
                                </Button>
                            }
                        </form>
                    </Modal>
                </div>
            }
        </>
    )
}

export default TaskPage