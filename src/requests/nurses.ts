import { request } from "../utils";
import { INurse } from "../utils/interfaces";

interface INurseList {
  data: Array<INurse>;
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

export const getAllNurses = async (page: number, perPage: number) => {
  try {
    const response = await request.get(
      `/nurses?page=${page}&per_page=${perPage}`,
    );
    return response as INurseList | null;
  } catch (error) {
    console.error(error);
  }
};

export const createNurse = async (nurse: INurse) => {
  try {
    return await request.post("/nurses", {
      minutes_per_week: nurse.minutes_per_week,
      fname: nurse.fname,
      lname: nurse.lname,
      mail: nurse.mail,
      phone: nurse.phone,
      password: nurse.password,
      address: {
        number: nurse.address.number,
        street_name: nurse.address.street_name,
        postcode: nurse.address.postcode,
        city_name: nurse.address.city_name,
        complement: nurse.address.complement,
        id_zone: nurse.address.id_zone,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const getNurseMe = async () => {
  try {
    const response = await request.get("/nurses/me");
    return response as INurse | null;
  } catch (error) {
    console.error(error);
  }
};

export const getNurse = async (id: number) => {
  try {
    const response = await request.get("/nurses/" + id);
    return response as INurse | null;
  } catch (error) {
    console.error(error);
  }
};

export const updateNurse = async (nurse: INurse) => {
  try {
    return await request.put("/nurses/" + nurse.id, {
      minutes_per_week: nurse.minutes_per_week,
      fname: nurse.fname,
      lname: nurse.lname,
      mail: nurse.mail,
      phone: nurse.phone,
      id_address: nurse.id_address,
      id_user: nurse.id_user,
      address: {
        number: nurse.address.number,
        street_name: nurse.address.street_name,
        postcode: nurse.address.postcode,
        city_name: nurse.address.city_name,
        complement: nurse.address.complement,
        id_zone: nurse.address.id_zone,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteNurse = async (id: number) => {
  try {
    return await request.delete("/nurses/" + id);
  } catch (error) {
    console.error(error);
  }
};

export const getNurseAvailabilities = async (
  id: number,
  page: number,
  perPage: number,
) => {
  try {
    return await request.get(
      "/nurses/" + id + `/availabilities?page=${page}&per_pape=${perPage}`,
    );
  } catch (error) {
    console.error(error);
  }
};

export const getNurseIcal = async (id: number) => {
  try {
    return await request.get("/nurses/" + id + "/ical");
  } catch (error) {
    console.error(error);
  }
};
