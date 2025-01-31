import { cookies } from "next/headers";
import { apiPayload } from "../types";
import { revalidatePath } from "next/cache";

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

export async function postJSONWithToken<T>(url: string, body: Partial<T>, revalidate?: string) : Promise<apiPayload<T>> {
    const cookieStore = await cookies();
    return new Promise(async (resolve, reject)=>{
        try {
            const token = cookieStore.get('token');
            if (!token) reject('Unauthorized')
            const response = await fetch(url, { method: 'POST', headers: {"Cookie": `token=${token?.value}`, "Content-Type": "application/json", "Accept": "application/json"}, body: JSON.stringify(body)})
            if (!response.ok) {
                console.log(response.statusText)
                reject(response.status);
            }
            const payload = await response.json();
            if (revalidate) revalidatePath(revalidate);
            resolve(payload as apiPayload<T>)
        } catch (error) {
            console.log("Post Error:", error)
            reject("Post error")
        }
    })
}

export async function patchJSONWithToken<T>(url: string, body: Partial<T>, revalidate?: string) : Promise<apiPayload<T>> {
    const cookieStore = await cookies();
    return new Promise(async (resolve, reject)=>{
        try {
            const token = cookieStore.get('token');
            if (!token) reject('Unauthorized')
            const response = await fetch(url, { method: 'PATCH', headers: {"Cookie": `token=${token?.value}`, "Content-Type": "application/json", "Accept": "application/json"}, body: JSON.stringify(body)})
            if (!response.ok) {
                console.log(response.statusText)
                reject(response.status);
            }
            const payload = await response.json();
            if (revalidate) revalidatePath(revalidate);
            resolve(payload as apiPayload<T>)
        } catch (error) {
            console.log("Post Error:", error)
            reject("Post error")
        }
    })
}