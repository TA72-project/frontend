import { request } from "../utils";
import { IZone } from "../utils/interfaces";

interface IZoneList {
  data: Array<IZone>;
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

export const getAllZones = async (
  id: number,
  page: number,
  perPage: number,
) => {
  try {
    const response = await request.get(
      `/centers/` + id + `/zones?page=${page}&per_page=${perPage}`,
    );
    return response as IZoneList;
  } catch (error) {
    console.error(error);
  }
};

export const createZone = async (name: string, id_center: number) => {
  try {
    return await request.post("/zones", {
      name,
      id_center,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getZone = async (id: number) => {
  try {
    const response = await request.get("/zones/" + id);
    return response as IZone;
  } catch (error) {
    console.error(error);
  }
};

export const updateZone = async (id: number, name: string, id_center: number) => {
  try {
    return await request.put("/zones/" + id, {
      name,
      id_center
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteZone = async (id: number) => {
  try {
    return await request.delete("/zones/" + id);
  } catch (error) {
    console.error(error);
  }
};
