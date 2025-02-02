'use server'

import { cookies } from "next/headers";
import { apiPayload } from "../types";
import { revalidatePath } from "next/cache";

function parseTags(url: string) {
    const matches = url.replace('localhost:3000', '').match(/\d+/);
    if (!matches || !matches[0]) return [];
    const id = matches[0];
    if (/logs/gi.test(url)) return ['logs'+id]
    if (/goals/gi.test(url)) return ['goals'+id]
    if (/resources/gi.test(url)) return ['resources'+id]
    if (/groups/gi.test(url)) return ['groups'+id]
    if (/messages/gi.test(url)) return ['messages'+id]
    if (/preferences/gi.test(url)) return ['preferences'+id]
    if (/approval_requests/gi.test(url)) return ['approval_requests'+id]
    
    return []
}

export async function fetchJSONWithToken<T>(url: string, revalidate: null | number = null): Promise<apiPayload<T>> {
    const cookieStore = await cookies();
    const tags = parseTags(url);

    const token = cookieStore.get('token');
    if (!token) {
        throw new Error('Unauthorized');
    }

    try {
        const response = await fetch(url, { 
            cache: revalidate ? undefined : 'no-cache', 
            next: revalidate ? { revalidate, tags } : {tags}, 
            headers: { "Cookie": `token=${token.value}` } 
        });

        if (!response.ok) {
            console.error("Fetch failed:", response.status, response.statusText);
            throw new Error(`Request failed with status: ${response.status}`);
        }
        const payload = await response.json()
        return payload as apiPayload<T>;
    } catch (error) {
        console.error("Fetch Error:", error);
        throw new Error("Fetch with JSON error");
    }
}

export async function postJSONWithToken<T>(url: string, body: Partial<T>, revalidate?: string[]): Promise<apiPayload<T>> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        throw new Error('Unauthorized'); // Ensure execution stops
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Cookie": `token=${token.value}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error("Fetch failed:", response.status, response.statusText);
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const payload = await response.json();

        if (revalidate) {
            for (const path of revalidate) {
                revalidatePath(path);
            }
        }

        return payload as apiPayload<T>;
    } catch (error) {
        console.error("Post Error:", error);
        throw new Error("Post error");
    }
}

export async function patchJSONWithToken<T>(url: string, body: Partial<T>, revalidate?: string[]) : Promise<apiPayload<T>> {
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
            if (revalidate) {
                for (const path of revalidate) {
                    revalidatePath(path);
                }
            }
            resolve(payload as apiPayload<T>)
        } catch (error) {
            console.log("Post Error:", error)
            reject("Post error")
        }
    })
}