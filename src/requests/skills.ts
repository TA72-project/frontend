import { request } from "../utils";
import { ISkill } from "../utils/interfaces";

interface ISkillList {
  data: Array<ISkill>;
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

export const getAllSkills = async (page: number, perPage: number) => {
  try {
    const response = await request.get(`/skills?page=${page}&per_page=${perPage}`);
    return response as ISkillList;
  } catch (error) {
    console.error(error);
  }
};

export const createSkill = async (name: string) => {
  try {
    return await request.post("/skills", {
      name,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getSkill = async (id: number) => {
  try {
    const response = await request.get("/skills/" + id);
    return response as ISkill;
  } catch (error) {
    console.error(error);
  }
};

export const updateSkill = async (id: number, name: string) => {
  try {
    return await request.put("/skills/" + id, {
      name,
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteSkill = async (id: number) => {
  try {
    return await request.delete("/skills/" + id);
  } catch (error) {
    console.error(error);
  }
};
