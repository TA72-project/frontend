export interface User {
    id: number;
    fname: string;
    lname: string;
    mail: string;
    phone: string;
    role: string;
}

export interface MissionType {
    id: number;
    name: string;
    peopleRequired: number;
    minutesDuration: number;
}