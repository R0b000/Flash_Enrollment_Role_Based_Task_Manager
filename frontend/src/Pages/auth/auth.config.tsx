import * as yup from 'yup'

export const Role = {
    USER: 'user',
    ADMIN: 'admin'
} as const;

export type RoleType = typeof Role[keyof typeof Role]

export interface registerProps {
    name: string,
    email: string,
    password: string, 
    role: RoleType
}

export const RegisterDTO = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email().required('Email is required'),
    password: yup.string().required('Password is required').min(6),
    role: yup.string().oneOf([Role.ADMIN, Role.USER]).default(Role.USER)
})