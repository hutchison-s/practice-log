import { fetchJSONWithToken } from "@/app/_utils/AuthHandler";

export type idType = string | number

export class DB_Controller<T> {
    protected API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    protected SITE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
    protected endpoint_base: string;
    
    constructor(endpoint: string) {
        this.endpoint_base = endpoint;
    }

    protected async otherTableAPICall<E>(full_path: string): Promise<E> {
        const {data, message} = await fetchJSONWithToken<T>(`${this.API_URL}${full_path}`, 60000)
        if (data == undefined) console.error("Error fetching data from", this.endpoint_base, ":", message);
        return data as E;
    }
    protected async apiCall<E>(path: string): Promise<E> {
        const {data, message} = await fetchJSONWithToken<T>(`${this.API_URL}${this.endpoint_base}${path}`, 60000)
        if (data == undefined) console.error("Error fetching data from", this.endpoint_base, ":", message);
        return data as E;
    }

    async getOneById(id: idType): Promise<T> {
        return await this.apiCall('/'+id);
    }
    async getAll(): Promise<T[]> {
        return await this.apiCall<T[]>('');
    }
    async getSome(limit?: number): Promise<T[]> {
        return await this.apiCall<T[]>(limit ? `?limit=${limit}` : '')
    }
}