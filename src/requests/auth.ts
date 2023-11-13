import {request} from "../utils";

export const login = async (mail: string, password: string) => {
    try {
        return await request.post('/auth/login',{
            mail,
            password
        });
    } catch (error) {
        console.error(error);
    }
};

export const logout = async () => {
    try {
        return await request.get('/auth/logout');
    } catch (error) {
        console.error(error);
    }
};