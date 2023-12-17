import { request } from "../utils";
import { IMission } from "../utils/interfaces";

interface IMissionList {
  data: Array<IMission>;
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

interface IMissionToAdd {
  id?: number;
  desc: string;
  start: string;
  end: string;
  recurrence_days: number | null;
  people_required: number;
  minutes_duration: number;
  id_mission_type: number;
  id_patient: number;
}

export const getAllMissions = async (page: number, perPage: number) => {
  try {
    const response = await request.get(
      `/missions?page=${page}&per_page=${perPage}`,
    );
    return response as IMissionList | null;
  } catch (error) {
    console.error(error);
  }
};

export const createMission = async (mission: IMissionToAdd) => {
  try {
    return await request.post("/missions", {
      desc: mission.desc,
      start: mission.start,
      end: mission.end,
      recurrence_days: mission.recurrence_days,
      people_required: mission.people_required,
      minutes_duration: mission.minutes_duration,
      id_mission_type: mission.id_mission_type,
      id_patient: mission.id_patient,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getMission = async (id: number) => {
  try {
    const response = await request.get("/missions/" + id);
    return response as IMission;
  } catch (error) {
    console.error(error);
  }
};

export const updateMission = async (mission: IMissionToAdd) => {
  try {
    return await request.put("/missions/" + mission.id, {
      desc: mission.desc,
      start: mission.start,
      end: mission.end,
      recurrence_days: mission.recurrence_days,
      people_required: mission.people_required,
      minutes_duration: mission.minutes_duration,
      id_mission_type: mission.id_mission_type,
      id_patient: mission.id_patient,
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteMission = async (id: number) => {
  try {
    return await request.delete("/missions/" + id);
  } catch (error) {
    console.error(error);
  }
};
