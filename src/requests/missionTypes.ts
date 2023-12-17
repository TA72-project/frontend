import { request } from "../utils";
import { IMissionType } from "../utils/interfaces";

interface IMissionTypeList {
  data: Array<IMissionType>;
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

export const getAllMissionType = async (page: number, perPage: number) => {
  try {
    const response = await request.get(
      `/mission_types?page=${page}&per_page=${perPage}`,
    );
    return response as IMissionTypeList;
  } catch (error) {
    console.error("Erreur lors de la recupération des types de mission", error);
    return null;
  }
};

export const getMissionType = async (id: number) => {
  try {
    const response = await request.get("/mission_types/" + id);
    return response as IMissionType;
  } catch (error) {
    console.error("Erreur lors de la recupération du type de mission", error);
    return null;
  }
};

export const createMissionType = async (
  name: string,
  people_required: number,
  minutes_duration: number,
) => {
  try {
    return await request.post("/mission_types", {
      name,
      people_required,
      minutes_duration,
    });
  } catch (error) {
    console.error("Erreur lors de la création du type de mission", error);
    throw error;
  }
};

export const updateMissionType = async (
  id: number,
  name: string,
  people_required: number,
  minutes_duration: number,
) => {
  try {
    return await request.put("/mission_types/" + id, {
      name,
      people_required,
      minutes_duration,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du type de mission", error);
    throw error;
  }
};
export const deleteMissionType = async (id: number) =>
  await request.delete("/mission_types/" + id);
