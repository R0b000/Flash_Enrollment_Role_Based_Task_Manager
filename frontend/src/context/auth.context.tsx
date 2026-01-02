import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";
import type { RoleType } from "../Pages/auth/auth.config";
import authSvc from "../service/auth.service";

export interface userProps {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    role: RoleType;
}

export interface authProps {
    user: userProps | null;
    setUser: React.Dispatch<React.SetStateAction<userProps | null>>;
}

const AuthContext = createContext<authProps>({
    user: null,
    setUser: () => {}
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<userProps | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await authSvc.user();
                setUser(response);
            } catch (error) {
                console.error(error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (isLoading) return null; // or loader component

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;