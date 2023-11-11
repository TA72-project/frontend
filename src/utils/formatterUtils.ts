import { User } from "../type/model";

export function formatUserName(user: User | null) : string{
    if(user != null) {
        return user.fname + " " + user.lname.toUpperCase();
    }
    return "";
}

export function formatUserAvatar(user: User | null) : string{
    if(user != null) {
        return user.fname[0].toUpperCase() + user.lname[0].toUpperCase();
    }
    return "";
}

export function formatPositiveInt(value: string | number) : number {
    const intValue = typeof value === 'string' ? parseInt(value) : value;

    if (Number.isNaN(intValue) || intValue <= 0) {
        return 0;
    }

    return intValue;
}