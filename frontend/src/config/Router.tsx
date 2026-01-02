import { createBrowserRouter } from "react-router-dom";
import PageLayout from "../Pages/layout/PageLayout";
import AuthLayout from "../Pages/auth/layout/AuthLayout";
import Register from "../Pages/auth/Register";
import Login from "../Pages/auth/Login";
import TaskLayout from "../Pages/task/layout/TaskLayout";
import TaskPage from "../Pages/task/TaskPage";

const router = createBrowserRouter([
    {path: '', Component: PageLayout},
    {path: '/auth', Component: AuthLayout, children: [
        {path: 'register', Component: Register},
        {path: 'login', Component: Login}
    ]}, 
    {path: '/', Component: TaskLayout, children: [
        {path: '/admin', Component: TaskPage},
        {path: '/user', Component: TaskPage}
    ]} 
])

export default router