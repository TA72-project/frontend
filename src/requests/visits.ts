import {request} from "../utils";

export const getAllVisits = async (page: number, perPage: number) => {
    try {
        return await request.get(`/visits?page=${page}&per_page=${perPage}`);
    } catch (error) {
        console.error(error);
    }
};

export const createVisit = async (start: string, end: string, idMission: number) => {
    try {
        return await request.post('/visits',{
            start,
            end,
            id_mission: idMission
        });
    } catch (error) {
        console.error(error);
    }
};

export const getVisit = async (id: number) => {
    try {
        return await request.get('/visits/'+id);
    } catch (error) {
        console.error(error);
    }
};

export const updateVisit = async (id: number, start: string, end: string) => {
    try {
        return await request.put('/visits/'+id,{
            start,
            end
        });
    } catch (error) {
        console.error(error);
    }
};

export const deleteVisit = async (id: number) => {
    try {
        return await request.delete('/visits/'+id);
    } catch (error) {
        console.error(error);
    }
};