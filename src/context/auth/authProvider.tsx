import {FC, ReactNode, useCallback, useState} from "react";
import {useNavigate} from "react-router";
import AuthContext, {IFormValues} from "./authContext.ts";
import {login, logout} from "../../requests/auth.ts";

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<IFormValues>({
        mail: "",
        password: "",
    });

    const [isLogin, setIsLogin] = useState(false);

    const handleLogin = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        login(formValues.mail,formValues.password).then(()=>{
            navigate("/tableau_de_bord");
            setIsLogin((prevState)=>!prevState);
        });
        },
        [formValues, navigate]
    );

    const handleLogout = async () => await logout().then(() => {
        navigate("/login");
        setIsLogin((prevState)=>!prevState);
    });

    const sharedValues = {
        login: handleLogin,
        logout: handleLogout,
        formValues: formValues,
        setFormValues: setFormValues,
        isLogin: isLogin,
        setIsLogin: setIsLogin,
    };

    return (
        <AuthContext.Provider value={sharedValues}>
            {children}
        </AuthContext.Provider>
    );
};
