import {FC, ReactNode, useCallback, useState} from "react";
import {useNavigate} from "react-router";
import {request} from "../../utils";
import AuthContext, {IFormValues} from "./authContext.ts";

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<IFormValues>({
        mail: "",
        password: "",
    });

    const handleLogin = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        request.post("/auth/login", formValues).then(()=>{
            navigate("/tableau_de_bord");
        });
        },
        [formValues, navigate]
    );

    const handleLogout = async () => await request.get("/auth/logout").then(() => {
        navigate("/login");
    });

    const sharedValues = {
        login: handleLogin,
        logout: handleLogout,
        formValues: formValues,
        setFormValues: setFormValues,
    };

    return (
        <AuthContext.Provider value={sharedValues}>
            {children}
        </AuthContext.Provider>
    );
};
