import { cookies } from "next/headers";
import { apiPayload } from "./types";

export async function fetchWithToken(url: string): Promise<Response> {
    const cookieStore = await cookies();
    return new Promise((resolve, reject)=>{
        try {
            const token = cookieStore.get('token');
            const response = fetch(url, { cache: "no-cache", headers: {"Cookie": `token=${token!.value}`} })
            resolve(response)
        } catch (error) {
            reject({message: 'You do not have permission to view this page.', error})
        }
    })
}

export async function fetchJSONWithToken<T>(url: string): Promise<apiPayload<T>> {
    return new Promise(async (resolve, reject)=>{
        try {
            const response = await fetchWithToken(url);
            if (!response.ok) reject(response);
            const payload = await response.json();
            resolve(payload as apiPayload<T>)
        } catch (error) {
            reject(error)
        }
    })
}