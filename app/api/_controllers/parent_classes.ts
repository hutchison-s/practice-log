import { fetchJSONWithToken, patchJSONWithToken, postJSONWithToken } from "@/app/_utils/AuthHandler";

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
    protected async apiGET<E>(path: string): Promise<E> {
        const {data, message} = await fetchJSONWithToken<T>(`${this.API_URL}${this.endpoint_base}${path}`, 60000)
        if (data == undefined) console.error("Error fetching data from", this.endpoint_base, ":", message);
        return data as E;
    }
    protected async apiPOST<T>(path: string, obj: Partial<T>, revalidatePath?: string[]): Promise<T> {
        const {data, message} = await postJSONWithToken<T>(`${this.API_URL}${this.endpoint_base}${path}`, obj, revalidatePath)
        if (data == undefined) console.error("Error posting data to", this.endpoint_base, ":", message);
        return data as T;
    }
    protected async apiPATCH<T>(path: string, obj: Partial<T>, revalidatePath?: string[]): Promise<T> {
        const {data, message} = await patchJSONWithToken<T>(`${this.API_URL}${this.endpoint_base}${path}`, obj, revalidatePath)
        if (data == undefined) console.error("Error posting data to", this.endpoint_base, ":", message);
        return data as T;
    }

    async getOneById(id: idType): Promise<T> {
        return await this.apiGET('/'+id);
    }
    async getAll(): Promise<T[]> {
        return await this.apiGET<T[]>('');
    }
    async getSome(limit?: number): Promise<T[]> {
        return await this.apiGET<T[]>(limit ? `?limit=${limit}` : '')
    }
    async createOne(obj: Partial<T>) {
        return await this.apiPOST(`/`, obj)
    }
    async updateOne(id: idType, obj: Partial<T>) {
        return await this.apiPATCH(`/`+id, obj)
    }
}