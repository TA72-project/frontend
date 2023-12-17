import { request } from "../utils";
import { INurseVisit, IReportVisit, IVisit } from "../utils/interfaces";
interface IVisitList {
  data: Array<IVisit>;
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

interface INurseVisitList {
  data: Array<INurseVisit>;
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

interface IReportVisitList {
  data: Array<IReportVisit>;
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

export const getAllVisits = async (page: number, perPage: number) => {
  try {
    const response = await request.get(
      `/visits?page=${page}&per_page=${perPage}`,
    );
    return response as IVisitList | null;
  } catch (error) {
    console.error(error);
  }
};

export const createVisit = async (
  start: string,
  end: string,
  idMission: number,
) => {
  try {
    const response = await request.post("/visits", {
      start,
      end,
      id_mission: idMission,
    });
    return response as unknown as number;
  } catch (error) {
    console.error(error);
  }
};

export const associateVisitNurse = async (
  idVisit: number,
  idNurse: number
) => {
  try {
    return await request.post("/visits/" + idVisit + "/nurses/" + idNurse, {});
  } catch (error) {
    console.error(error);
  }
};

export const getVisit = async (id: number) => {
  try {
    const response = await request.get("/visits/" + id);
    return response as IVisit | null;
  } catch (error) {
    console.error(error);
  }
};

export const getVisitNurses = async (id: number) => {
  try {
    const response = await request.get("/visits/" + id + "/nurses");
    return response as INurseVisitList | null;
  } catch (error) {
    console.error(error);
  }
};

export const getVisitReports = async (id: number) => {
  try {
    const response = await request.get("/visits/" + id + "/reports");
    return response as IReportVisitList | null;
  } catch (error) {
    console.error(error);
  }
};

export const updateVisit = async (id: number, start: string, end: string) => {
  try {
    return await request.put("/visits/" + id, {
      start,
      end,
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteVisit = async (id: number) => {
  try {
    return await request.delete("/visits/" + id);
  } catch (error) {
    console.error(error);
  }
};

export const dissociateNurseVisit = async (idVisit: number, idNurse: number) => {
  try {
    return await request.delete("/visits/" + idVisit + "/nurses/" + idNurse);
  } catch (error) {
    console.error(error);
  }
};
