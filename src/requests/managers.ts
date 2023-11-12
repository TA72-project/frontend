import {request} from "../utils";


export const getAllManagers = async (page: number, perPage: number) => {
    try {
        return await request.get(`/managers?page=${page}&per_page=${perPage}`)
    } catch (error){
        console.error(error)
    }
};

export const createManager = async (idUser: number, idCenter: number, fname: string, lname: string, mail: string, phone: string | null, password: string) => {
    try {
        return await request.post('/managers',{
            id_user: idUser,
            id_center: idCenter,
            fname: fname,
            lname: lname,
            mail: mail,
            phone: phone,
            password: password
        })
    } catch (error){
        console.error(error)
    }
};

export const getMe = async () => {
    try {
        return await request.get('/managers/me');
    } catch (error) {
        console.error(error)
    }
};

export const getManager = async (id: number) => {
    try {
        return await request.get('/managers/'+id)
    } catch (error) {
        console.error(error)
    }
}

export const deleteManager = async (id: number) => {
    try {
        return await request.delete('/managers/'+id)
    } catch (error) {
        console.error(error)
    }
}