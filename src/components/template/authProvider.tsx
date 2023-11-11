import React, {useEffect, useState} from "react";
import {login, logout} from "../../hook/auth";
import {useNavigate} from "react-router";
import { User } from "../../type/model";

interface Props{
    children: JSX.Element | string
}

interface AuthContextType{
    currentUser: User | null
    onLogin?: (email: string, password: string) => Promise<void>;
    onLogout?: () => Promise<void>;
    isLoggedIn: boolean;
    newLogin?: boolean;
    isSaved: boolean;
    closeRecord: (status:boolean) => void;
}

const AuthContext = React.createContext<AuthContextType>({
    currentUser: null,
    isLoggedIn: false,
    isSaved: false,
    closeRecord: () => {},
});

export const useAuth = () => {
    return React.useContext(AuthContext);
};

export const AuthProvider = ({ children }: Props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [newLogin, setNewLogin] = useState(false);
    const [currentUser, setCurrentUser] = React.useState<User | null>(() => {
        const storedUser = localStorage.getItem("currentUser");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const navigate = useNavigate();

    const handleLogin = async (email: string, password: string): Promise<void> => {
        const res = await login(email, password);
        setCurrentUser(res);
        setIsLoggedIn(true);
        setNewLogin(true);
        localStorage.setItem("currentUser", JSON.stringify(res));
        navigate("tableau_de_bord");
    };

    const handleLogout = async (): Promise<void> => {
        await logout();
        setIsLoggedIn(false);
        localStorage.removeItem("currentUser");
        navigate("");
    };

    const onRecordComplete = (status:boolean) : void => {
        setIsSaved(status);
    };

    useEffect(() => {
        if (!isLoggedIn) {
          localStorage.removeItem("currentUser");
        }
    }, [isLoggedIn]);

    const value = {
        onLogin: handleLogin,
        onLogout: handleLogout,
        isLoggedIn,
        newLogin,
        currentUser,
        isSaved,
        closeRecord: onRecordComplete,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};