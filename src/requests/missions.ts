import {request} from "../utils";

export const getAllMissions = async (page: number, perPage: number) => {
    try {
        return await request.get(`/missions?page=${page}&per_page=${perPage}`);
    } catch (error) {
        console.error(error);
    }
};

export const createMission = async (description: string, start: string, end: string, reccurenceDays: number | null, peopleRequired: number | null, minutesDuration: number, idMissionType: number, idPatient: number)=> {
    try {
        return await request.post('/missions', {
            desc: description,
            start: start,
            end: end,
            reccurence_days: reccurenceDays,
            people_required: peopleRequired,
            minuyes_duration: minutesDuration,
            id_mission_type: idMissionType,
            id_patient: idPatient
        });
    } catch (error){
        console.error(error);
    }
};

export const getMission = async (id: number) => {
    try {
        return await request.get('/missions/'+id);
    } catch (error){
        console.error(error);
    }
};

export const updateMission = async (id: number, description: string, start: string, end: string, reccurenceDays: number | null, peopleRequired: number | null, minutesDuration: number, idMissionType: number) => {
    try {
        return await request.put('/missions/'+id,{
            desc: description,
            start: start,
            end: end,
            reccurence_days: reccurenceDays,
            people_required: peopleRequired,
            minutes_duration: minutesDuration,
            id_mission_type: idMissionType
        });
    } catch (error){
        console.error(error);
    }
};

export const deleteMission = async (id: number) => {
    try {
        return await request.delete('/missions/'+id);
    } catch (error) {
        console.error(error);
    }
};