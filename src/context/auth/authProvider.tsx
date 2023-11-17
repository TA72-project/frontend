import {createContext, Dispatch, ReactElement, SetStateAction, useContext, useState} from "react";
import {IManager} from "../../requests/managers.ts";

interface IAuthContextType {
    userInfo: IManager | null | undefined;
    setUserInfo: Dispatch<SetStateAction<IManager | null | undefined>>;
    isLogin: boolean;
    setIsLogin: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<IAuthContextType>({
    userInfo: null,
    setUserInfo: () => {},
    isLogin: false,
    setIsLogin: () => {},
});

export const AuthProvider = ({children}: {children: ReactElement}) => {
    const [userInfo, setUserInfo] = useState<IManager | null | undefined>();
    const [isLogin, setIsLogin] = useState(false);

    const contextValue: IAuthContextType = {
        userInfo,
        setUserInfo,
        isLogin,
        setIsLogin
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = (): IAuthContextType => {
    return useContext(AuthContext);
};
