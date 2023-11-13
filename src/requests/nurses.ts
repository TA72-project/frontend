import {request} from "../utils";

export const getAllNurses = async (page: number, perPage: number) => {
    try {
        return await request.get(`/nurses?page=${page}&per_page=${perPage}`);
    } catch (error) {
        console.eror(error);
    }
};

export const createNurse = async (minutesPerweek: number, fname: string, lname: string, mail: string, phone: string | null, password: string, address: {number: number, streetName: string, postcode: string, cityName: string, complement: string | null, idZone: number}) => {
    try {
        return await request.post('/nurses',{
            minutes_per_week: minutesPerweek,
            fname: fname,
            lname: lname,
            mail: mail,
            phone: phone,
            password: password,
            address:{
                number: address.number,
                street_name: address.streetName,
                postcode: address.postcode,
                city_name: address.cityName,
                complement: address.complement,
                id_zone: address.idZone
            }
        });
    } catch (error) {
        console.error(error);
    }
};


export const getNurseMe = async () => {
    try {
        return await request.get('/nurses/me');
    } catch (error) {
        console.error(error);
    }
};

export const getNurse = async (id: number) => {
    try {
        return await request.get('/nurses/'+id);
    } catch (error) {
        console.error(error);
    }
};

export const updateNurse = async (id: number, minutesPerWeek: number) => {
    try {
        return await request.put('/nurses/'+id,{
            minutes_per_week: minutesPerWeek,
        });
    } catch (error) {
        console.error(error);
    }
};


export const deleteNurse = async (id: number) => {
    try {
        return await request.delete('/nurses/'+id);
    } catch (error) {
        console.error(error);
    }
};

export const getNurseAvailabilities = async (id: number, page: number, perPage: number) => {
    try {
        return await request.get('/nurses/'+id+`/availabilities?page=${page}&per_pape=${perPage}`);
    } catch (error) {
        console.error(error);
    }
};

export const getNurseIcal = async (id: number) => {
    try {
        return await request.get('/nurses/'+id+'/ical');
    } catch (error) {
        console.error(error);
    }
};