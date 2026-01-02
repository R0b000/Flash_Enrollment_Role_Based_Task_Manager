import * as yup from 'yup';

export interface userMainDataProps {
    completed: number, 
    description: string, 
    id: string, 
    title: string,
    user_id: string, 
}

export interface userDataDataProps {
    current_page: number,
    data: userMainDataProps[],
    first_page_url: string,
    last_page: number,
    last_page_url: string,
    next_page_url: string,
    path: string,
    prev_page_url: string,
    to: number,
    total: number,
}

export interface userDataProps {
    data: userDataDataProps,
    message: string,
}

export interface updateDataProps {
    completed: number | null, 
    title: string | null, 
    description: string | null,
}

export interface createTaskProps {
    title: string, 
    description: string
}

export const createTaskDTO = yup.object({
    title: yup.string().required(),
    description: yup.string().max(500, 'Description cannot exceed 500 characters').optional().nullable(),
})