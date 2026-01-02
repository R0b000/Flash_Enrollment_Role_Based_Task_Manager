import axiosConfig from "../config/Axios"
import type { createTaskProps, userDataProps } from "../Pages/task/task.config"

class TaskService {
    list = async (page: number | 1, user_id: string | null) => {
        const response = await axiosConfig.get('/tasks', {
            params: {
                Page: page,
                user_id: user_id
            }
        })
        return response.data
    } 
    create = async (data: createTaskProps) => {
        const response = await axiosConfig.post('/tasks', data)
        return response.data
    }
    show = async (id: string) => {
        const response = await axiosConfig.get(`/tasks/${id}`)
        return response.data
    } 
    update = async (id: string, data: userDataProps) => {
        console.log(id, data)
        const response = await axiosConfig.put(`/tasks/${id}`, data)
        return response.data
    }
    delete = async (id: string) => {
        const response = await axiosConfig.delete(`/tasks/${id}`)
        return response.data
    }
}

const taskSvc = new TaskService();

export default taskSvc