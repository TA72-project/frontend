export interface IAddress {
  id?: number;
  number: number;
  street_name: string;
  postcode: string;
  city_name: string;
  complement: string;
  id_zone: number;
}

export interface IMissionType {
  id: number;
  name: string;
  people_required: number;
  minutes_duration: number;
}

export interface IMission {
  id: number;
  desc: string;
  start: string;
  end: string;
  recurrence_days: number;
  people_required: number;
  minutes_duration: number;
  archived: boolean;
  id_mission_type: number;
  id_patient: number;
  mission_type: IMissionType;
  patient: IPatient;
}

export interface IVisit {
  id: number;
  start: string;
  end: string;
  id_mission: number;
  mission: IMission;
}

export interface INurse {
  id?: number;
  minutes_per_week: number;
  id_user?: number;
  id_address?: number;
  fname: string;
  lname: string;
  mail: string;
  phone: string;
  password?: string;
  address: IAddress;
  skills?: ISkill[];
}

export interface IManager {
  id?: number;
  id_user?: number;
  id_center: number;
  fname: string;
  lname: string;
  mail: string;
  phone: string;
  password?: string;
}

export interface IPatient {
  id?: number;
  id_user?: number;
  id_address?: number;
  fname: string;
  lname: string;
  mail: string;
  phone: string;
  address: IAddress;
  password: string,
}

export interface INurseVisit {
  id: number;
  minutes_per_week: number;
  id_user: number;
  id_address: number;
  fname: string;
  lname: string;
  mail: string;
  phone: string;
  address: IAddress;
}

export interface IReportVisit {
  id_visit: number;
  id_nurse: number;
  report: string;
}

export interface ISkill {
  id: number;
  name: string;
}

export interface ICenter {
  id: number;
  name: string;
  desc: string;
  workday_start: string;
  workday_end: string;
}

export interface IZone {
  id: number;
  name: string;
  id_center: number;
}

export interface ISelectField {
  name: string;
  value: number;
}
