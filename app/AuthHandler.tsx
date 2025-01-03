import { cookies } from "next/headers";
import { apiPayload } from "./types";

export async function fetchWithToken(url: string, revalidate: null | number = null): Promise<Response> {
    const cookieStore = await cookies();
    return new Promise((resolve, reject)=>{
        try {
            const token = cookieStore.get('token');
            if (!token) reject('Unauthorized')
            const response = fetch(url, { cache: revalidate ? undefined : 'no-cache', next: revalidate ? {revalidate: revalidate} : {}, headers: {"Cookie": `token=${token?.value}`} })
            resolve(response)
        } catch (error) {
            console.log("Fetch Error:", error)
            reject("Fetch error")
        }
    })
}

export async function fetchJSONWithToken<T>(url: string, revalidate: null | number = null): Promise<apiPayload<T>> {
    return new Promise(async (resolve, reject)=>{
        try {
            const response = await fetchWithToken(url, revalidate);
            if (!response.ok) {
                console.log(response.statusText)
                reject(response.status);
            }
            const payload = await response.json();
            resolve(payload as apiPayload<T>)
        } catch (error) {
            console.log("Fetch with JSON Error", error)
            reject(error)
        }
    })
}