import { createBrowserRouter } from "react-router-dom";
import PageLayout from "../Pages/layout/PageLayout";

const router = createBrowserRouter([
    {path: '', Component: PageLayout},
])

export default router