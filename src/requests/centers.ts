import { request } from "../utils";
import { ICenter } from "../utils/interfaces";

interface ICenterList {
  data: Array<ICenter>;
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

export const getAllCenters = async (page: number, perPage: number) => {
  try {
    const response = await request.get(
      `/centers?page=${page}&per_page=${perPage}`,
    );
    return response as ICenterList;
  } catch (error) {
    console.error(error);
  }
};

export const getCenter = async (id: number) => {
  try {
    const response = await request.get("/centers/" + id);
    return response as ICenter;
  } catch (error) {
    console.error(error);
  }
};
