import { request } from "../utils";
import { IPatient } from "../utils/interfaces";

interface IPatientList {
  data: Array<IPatient>;
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

export const getAllPatients = async (page: number, perPage: number) => {
  try {
    const response = await request.get(
      `/patients?page=${page}&per_page=${perPage}`,
    );
    return response as IPatientList;
  } catch (error) {
    console.error(error);
  }
};

export const createPatient = async (patient: IPatient) => {
  try {
    return await request.post("/patients", {
      fname: patient.fname,
      lname: patient.lname,
      mail: patient.mail,
      phone: patient.phone,
      address: {
        number: patient.address.number,
        street_name: patient.address.street_name,
        postcode: patient.address.postcode,
        city_name: patient.address.city_name,
        complement: patient.address.complement,
        id_zone: patient.address.id_zone,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const getPatient = async (id: number) => {
  try {
    const response = await request.get("/patients/" + id);
    return response as IPatient;
  } catch (error) {
    console.error(error);
  }
};

export const updatePatient = async (patient: IPatient) => {
  try {
    return await request.put("/patients/" + patient.id, {
      fname: patient.fname,
      lname: patient.lname,
      mail: patient.mail,
      phone: patient.phone,
      id_user: patient.id_user,
      id_address: patient.id_address,
      address: {
        number: patient.address.number,
        street_name: patient.address.street_name,
        postcode: patient.address.postcode,
        city_name: patient.address.city_name,
        complement: patient.address.complement,
        id_zone: patient.address.id_zone,
      },
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
