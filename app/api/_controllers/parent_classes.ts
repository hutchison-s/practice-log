import { deleteWithToken, fetchJSONWithToken, patchJSONWithToken, postJSONWithToken } from "@/app/_utils/AuthHandler";
import { redirect } from "next/navigation";

export type idType = string | number

export class DB_Controller<T> {
    protected API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    protected SITE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
    protected endpoint_base: string;
    
    constructor(endpoint: string) {
        this.endpoint_base = endpoint;
    }

    protected async otherTableAPICall<E>(full_path: string): Promise<E> {
        try {
            const {data, message} = await fetchJSONWithToken<T>(`${this.API_URL}${full_path}`)
            if (data == undefined) console.error("Error fetching data from", this.endpoint_base, ":", message);
            return data as E;
        } catch (error) {
            if (error == 'Error: unauthorized') {
                redirect('/unauthorized')
            } else {
                throw new Error('Something went wrong while trying to communicate with our api')
            }
        }
    }
    protected async apiGET<E>(path: string): Promise<E> {
        try {
            const {data, message} = await fetchJSONWithToken<T>(`${this.API_URL}${this.endpoint_base}${path}`)
            if (data == undefined) console.error("Error fetching data from", this.endpoint_base, ":", message);
            return data as E;
        } catch (error) {
            if (error == 'Error: unauthorized') {
                redirect('/unauthorized')
            } else {
                throw new Error('Something went wrong while trying to communicate with our api')
            }
        }
    }
    protected async apiPOST<T>(path: string, obj: Partial<T>, revalidatePath?: string[]): Promise<T> {
        try {
            const {data, message} = await postJSONWithToken<T>(`${this.API_URL}${this.endpoint_base}${path}`, obj, revalidatePath)
            if (data == undefined) console.error("Error posting data to", this.endpoint_base, ":", message);
            return data as T;
        } catch (error) {
            if (error == 'Error: unauthorized') {
                redirect('/unauthorized')
            } else {
                throw new Error('Something went wrong while trying to communicate with our api')
            }
        }
    }
    protected async apiPATCH<T>(path: string, obj: Partial<T>, revalidatePath?: string[]): Promise<T> {
        try {
            const {data, message} = await patchJSONWithToken<T>(`${this.API_URL}${this.endpoint_base}${path}`, obj, revalidatePath)
            if (data == undefined) console.error("Error patching data to", this.endpoint_base, ":", message);
            return data as T;
        } catch (error) {
            if (error == 'Error: unauthorized') {
                redirect('/unauthorized')
            } else {
                throw new Error('Something went wrong while trying to communicate with our api')
            }
        }
    }
    protected async apiDELETE<T>(path: string): Promise<T> {
        try {
            const {data, message} = await deleteWithToken<T>(`${this.API_URL}${this.endpoint_base}${path}`)
            if (!data && !message) console.error("Error deleting data at", this.endpoint_base, ":", message);
            return data as T;
        } catch (error) {
            if (error == 'Error: unauthorized') {
                redirect('/unauthorized')
            } else {
                throw new Error('Something went wrong while trying to communicate with our api')
            }
        }
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
        return await this.apiPOST<T>(`/`, obj)
    }
    async updateOne(id: idType, obj: Partial<T>) {
        return await this.apiPATCH<T>(`/`+id, obj)
    }
    async deleteOne(id: idType) {
        return await this.apiDELETE<null>(`/${id}`);
    }
}