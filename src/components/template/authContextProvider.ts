import React from "react";
import { User } from "../../type/model";

interface AuthContextType {
    currentUser: User | null;
    onLogin?: (email: string, password: string) => Promise<void>;
    onLogout?: () => Promise<void>;
    isLoggedIn: boolean;
    newLogin?: boolean;
    isSaved: boolean;
    closeRecord: (status: boolean) => void;
}

export const AuthContext = React.createContext<AuthContextType>({
    currentUser: null,
    isLoggedIn: false,
    isSaved: false,
    closeRecord: () => {},
});

export const useAuth = () => {
    return React.useContext(AuthContext);
};