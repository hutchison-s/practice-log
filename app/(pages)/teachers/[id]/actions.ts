'use server'

import { AssociatedStudentRecords } from "@/app/_hooks/studentBrowserReducer";
import { fetchJSONWithToken } from "@/app/_utils/AuthHandler";
import { logRow, Goal, Resource, Group, ApprovalRequest } from "@/app/types";
import { weeklyTotal } from "@/app/types";

const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchStudentRecords(id: string, limit?:number): Promise<AssociatedStudentRecords> {
    const logPromise = fetchJSONWithToken<logRow[]>(`${apiURL}/students/${id}/logs${limit ? '?limit='+limit : ''}`, 3600);
    const goalPromise = fetchJSONWithToken<Goal[]>(`${apiURL}/students/${id}/goals${limit ? '?limit='+limit : ''}`, 3660);
    const resourcePromise = fetchJSONWithToken<Resource[]>(`${apiURL}/students/${id}/resources${limit ? '?limit='+limit : ''}`, 3600);
    const [logs, goals, resources] = (await Promise.all([logPromise, goalPromise, resourcePromise]))
    return {
        logs: logs.data || [],
        goals: goals.data || [],
        resources: resources.data || []
    }
}

export async function fetchCurrentWeekTotal(student_id: string): Promise<weeklyTotal[]> {
    return new Promise(async (resolve, reject)=>{
        const {data, message} = await fetchJSONWithToken<weeklyTotal[]>(`${apiURL}/students/${student_id}/logs/week_total?current=true`, 1800)
        if (data == undefined) reject(message)
        resolve(data as weeklyTotal[]);
    })
}
export async function fetchWeekHistory(student_id: string): Promise<weeklyTotal[]> {
    return new Promise(async (resolve, reject)=>{
        const {data, message} = await fetchJSONWithToken<weeklyTotal[]>(`${apiURL}/students/${student_id}/logs/week_total`, 60000);
        if (data == undefined) reject(message)
        resolve(data as weeklyTotal[]);
    })
}

export async function fetchUnreadMessages(student_id: string): Promise<number> {
    return new Promise(async (resolve, reject)=>{
        const {data, message} = await fetchJSONWithToken<number>(`${apiURL}/students/${student_id}/messages/unread`, 1800)
        if (data == undefined) reject('Failed to retrieve message data:'+message);
        resolve(data as number);
    })
}

export async function fetchGroup(teacher_id: string, group_id: string): Promise<Group> {
    return new Promise(async (resolve, reject)=>{
        const {data, message} = await fetchJSONWithToken<Group>(`${apiURL}/teachers/${teacher_id}/groups/${group_id}`, 60000)
        if (data == undefined) reject('Failed to retrieve message data:'+message);
        resolve(data as Group);
    })
}

export async function fetchLogApprovals(teacher_id: string): Promise<ApprovalRequest[]> {
    const {data: approval_requests} = await fetchJSONWithToken<ApprovalRequest[]>(`${apiURL}/teachers/${teacher_id}/approval_requests`);
    return approval_requests || [];
}
