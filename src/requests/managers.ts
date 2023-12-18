import { request } from "../utils";
import { IManager } from "../utils/interfaces";

interface IManagerList {
  data: Array<IManager>;
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

export const getAllManagers = async (page: number, perPage: number) => {
  try {
    const response = await request.get(
      `/managers?page=${page}&per_page=${perPage}`,
    );
    return response as IManagerList;
  } catch (error) {
    console.error(error);
  }
};

export const createManager = async (manager: IManager) => {
  try {
    return await request.post("/managers", {
      id_center: manager.id_center,
      fname: manager.fname,
      lname: manager.lname,
      mail: manager.mail,
      phone: manager.phone,
      password: manager.password,
    });
  } catch (error) {
    console.error(error);
  }
};

export const udpdateManager = async (manager: IManager) => {
  try {
    return await request.put("/managers/" + manager.id, {
      id_user: manager.id_user,
      id_center: manager.id_center,
      fname: manager.fname,
      lname: manager.lname,
      mail: manager.mail,
      phone: manager.phone,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getMe = async () => {
  try {
    const response = await request.get("/managers/me");
    return response as IManager | null;
  } catch (error) {
    console.error(error);
  }
};

export const getManager = async (id: number) => {
  try {
    const response = await request.get("/managers/" + id);
    return response as IManager;
  } catch (error) {
    console.error(error);
  }
};

export const deleteManager = async (id: number) => {
  try {
    return await request.delete("/managers/" + id);
  } catch (error) {
    console.error(error);
  }
};
