import {request} from "../utils";

interface IMission {
    data: Array<{
        id: number,
        desc: string | null,
        start: string,
        end: string,
        recurrence_days: number | null,
        people_required: number,
        minutes_duration: number,
        id_mission_type: number,
        id_patient: number,
        mission_type: {
            id: number,
            name: string,
            perople_required: number,
            minutes_duration: number
        },
        patient: {
            id: number,
            id_user: number,
            id_address: number,
            fname: string,
            lname: string,
            mail: string,
            phone: string | null,
            address: {
                id: number,
                number: number | null,
                street_name: string,
                postcode: string,
                city_name: string,
                complement: string | null,
                id_zone: number,
            }
        }
    }>,
    page: number,
    per_page: number,
    total: number,
    total_page: number,
}

export const getAllMissions = async (page: number, perPage: number) => {
    try {
        const response = await request.get(`/missions?page=${page}&per_page=${perPage}`);
        return response as IMission | null;
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