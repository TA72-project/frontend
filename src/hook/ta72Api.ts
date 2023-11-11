import type {AxiosInstance} from 'axios';
import axios from 'axios';
import {config} from "../config/apiConfig";

class ta72Api {
    private instances: Record<string, AxiosInstance>;

    public constructor() {
        this.instances = {};
    }

    private createInstance(route: string){
        const instance = axios.create({
            baseURL: config.api_base_url + (route === "default" ? "" : route),
            withCredentials: true,
        });
        this.instances[route] = instance;
        return instance;
    }

    public getInstance(route: string = "default"){
        if(Object.prototype.hasOwnProperty.call(this.instances, route)){
            return this.instances[route];
        }
        return this.createInstance(route);
    }
}

export const frontApi = new ta72Api();
export const authApi = frontApi.getInstance(config.auth_route);
export const managersMeApi = frontApi.getInstance(config.managers_route);
export const missionTypeApi = frontApi.getInstance(config.mission_type_route);
