import { request } from "../utils";

export const getAllCenters = async (page: number, perPage: number) => {
  try {
    return await request.get(`/centers?page=${page}&per_page=${perPage}`);
  } catch (error) {
    console.error(error);
  }
};

export const getCenter = async (id: number) => {
  try {
    return await request.get("/centers/" + id);
  } catch (error) {
    console.error(error);
  }
};

export const getZones = async (id: number, page: number, perPage: number) => {
  try {
    return await request.get(
      `/centers/` + id + `/zones?page=${page}&per_page=${perPage}`,
    );
  } catch (error) {
    console.error(error);
  }
};
