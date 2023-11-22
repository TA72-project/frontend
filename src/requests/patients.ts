import { request } from "../utils";

export const getAllPatients = async (page: number, perPage: number) => {
  try {
    return await request.get(`/patients?page=${page}&per_page=${perPage}`);
  } catch (error) {
    console.error(error);
  }
};

export const createPatient = async (
  fname: string,
  lname: string,
  mail: string,
  phone: string,
  password: string,
  address: string,
) => {
  try {
    return await request.post("/patients", {
      fname,
      lname,
      mail,
      phone,
      password,
      address,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getPatient = async (id: number) => {
  try {
    return await request.get("/patients/" + id);
  } catch (error) {
    console.error(error);
  }
};

export const updatePatient = async (
  id: number,
  idUser: number,
  idAddress: number,
) => {
  try {
    return await request.put("/patients/" + id, {
      id_user: idUser,
      id_address: idAddress,
    });
  } catch (error) {
    console.error(error);
  }
};

export const deletePatient = async (id: number) => {
  try {
    return await request.delete("/patients/" + id);
  } catch (error) {
    console.error(error);
  }
};
