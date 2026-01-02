import { AiOutlineCopyrightCircle } from "react-icons/ai";

const Footer = () => {
    return (
        <div className="flex flex-col h-auto w-full bg-gray-100 shadow-inner items-center justify-between p-4 mt-4">
            {/* Left Section */}
            <div className="flex items-center space-x-2">
                <AiOutlineCopyrightCircle className="text-xl" />
                <span className="text-sm md:text-base">@Role Based Task Manager</span>
            </div>

            {/* Center Section */}
            <div className="text-sm md:text-base">
                @Flash Enrollment
            </div>

            {/* Right Section */}
            <div className="text-sm md:text-base">
                @2026 All Rights Reserved
            </div>
        </div>
    );
};

export default Footer;
