'use server'

import { AssociatedStudentRecords } from "@/app/_hooks/studentBrowserReducer";
import { fetchJSONWithToken } from "@/app/_utils/AuthHandler";
import { logRow, Goal, Resource, Enrollee, User } from "@/app/types";

const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;

type StudentPageInfo = {
    student: Enrollee,
    records: AssociatedStudentRecords,
    teacher: User
}

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

export async function fetchStudent(id: string): Promise<Enrollee> {
    const {data, message} = await fetchJSONWithToken<Enrollee>(`${apiURL}/students/${id}`, 3600);
    if (data == undefined) throw new Error(message);
    return data;
}

export async function fetchTeacher(id: string): Promise<User> {
    const {data, message} = await fetchJSONWithToken<User>(`${apiURL}/teachers/${id}`, 3600);
    if (data == undefined) throw new Error(message);
    return data;
}

export async function fetchStudentPageInfo(student_id: string): Promise<StudentPageInfo> {
    const student = await fetchStudent(student_id);
    const teacherPromise = fetchTeacher(student.teacher_id);
    const recordsPromise = fetchStudentRecords(student_id);
    const [teacher, records] = await Promise.all([teacherPromise, recordsPromise]);
    return {
        student,
        teacher,
        records
    }
}