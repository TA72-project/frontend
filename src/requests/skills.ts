import {request} from "../utils";

export const getAllSkills = async (page: number, perPage: number) => {
    try {
        return await request.get(`/skills?page=${page}&per_page=${perPage}`);
    } catch (error) {
        console.error(error);
    }
};

export const createSkill = async (name: string) => {
    try {
        return await request.post('/skills', {
            name
        });
    } catch (error) {
        console.error(error);
    }
};

export const getSkill = async (id: number) => {
    try {
        return await request.get('/skills/'+id);
    } catch (error) {
        console.error(error);
    }
};

export const updateSkill = async (id: number, name: string) => {
    try {
        return await request.put('/skills/'+id,{
            name
        });
    } catch (error) {
        console.error(error);
    }
};

export const deleteSkill = async (id: number) => {
    try {
        return await request.delete('/skills/'+id);
    } catch (error) {
        console.error(error);
    }
};