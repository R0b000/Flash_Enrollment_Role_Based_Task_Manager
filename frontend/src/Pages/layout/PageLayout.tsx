import AuthLayout from "../auth/layout/AuthLayout"

const PageLayout = () => {
    return (
        <div className="flex flex-col w-full h-svh items-center justify-center">
            <div className="w-50 h-60 flex items-center justify-center p-2">
                <AuthLayout/>
            </div>
        </div>
    )
}

export default PageLayout