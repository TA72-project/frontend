import { MissionType } from "../type/model";
import { missionTypeApi} from "./ta72Api";

type MissionTypeApi = {
    id: number;
    name: string;
    people_required: number;
    minutes_duration: number;
}

type MissionTypePostApi = {
    name: string;
    people_required: number;
    minutes_duration: number;
}

type resAllMissionGrid = {
    data: MissionType[],
    total: number,
}

export const getAllMissionType = async (page: number, perPage: number): Promise<resAllMissionGrid> => {
    const apiRes = await missionTypeApi.get('', {
        params: {
          page: page,
          per_page: perPage,
        },
    });
    if(apiRes.status === 200){
        const missionTypes: MissionType[] = [];
        console.log(apiRes.data);
        apiRes.data.data.forEach((mt:MissionTypeApi) => {
            missionTypes.push({
                id: mt.id,
                name: mt.name,
                peopleRequired: mt.people_required,
                minutesDuration: mt.minutes_duration,
            })
        });
        return {
            data: missionTypes,
            total: apiRes.data.total,
        };
    }
    throw Error('Erreur de connexion');    
};

export const getMissionType = async (id: number): Promise<MissionType> => {
    const apiRes = await missionTypeApi.get('/' + id);
    if(apiRes.status === 200){
        return {
            id: apiRes.data.id,
            name: apiRes.data.name,
            peopleRequired: apiRes.data.people_required,
            minutesDuration: apiRes.data.minutes_duration,
        }
    }
    throw Error('Erreur de connexion');    
};

export const createMissionType = async (missionType:MissionTypePostApi): Promise<number> => {
    const apiRes = await missionTypeApi.post('', missionType);
    if(apiRes.status === 200){
        return apiRes.status;
    }
    throw Error('Erreur de connexion');    
};

export const updateMissionType = async (id:number, missionType:MissionTypePostApi): Promise<number> => {
    const apiRes = await missionTypeApi.put('/' + id, missionType);
    if(apiRes.status === 200){
        return apiRes.status;
    }
    throw Error('Erreur de connexion');    
};

export const deleteMissionType = async (id:number): Promise<number> => {
    const apiRes = await missionTypeApi.delete('/' + id);
    if(apiRes.status === 200){
        return apiRes.status;
    }
    throw Error('Erreur de connexion');    
};