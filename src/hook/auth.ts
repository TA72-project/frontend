import { User } from "../type/model";
import {authApi} from "./ta72Api";

export const login = async (mail: string, password: string): Promise<User> => {
    const apiRes = await authApi.post("/login", {mail, password});
    if(apiRes.status === 200){
        const user: User = {
            id: apiRes.data.id,
            lname: apiRes.data.lname,
            fname: apiRes.data.fname,
            mail: apiRes.data.mail,
            phone: apiRes.data.phone,
            role: apiRes.data.role,
        }
        return user;
    }
    throw Error('Erreur de connexion');
};

export const logout = async (): Promise<string> => {
    const apiRes = await authApi.get("/logout");
    if(apiRes.status === 200){
        return '';
    }
    throw Error('Erreur de connexion');
};