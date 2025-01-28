'use server'

import { AssociatedStudentRecords } from "@/app/_hooks/studentBrowserReducer";
import { Students } from "@/app/api/_controllers/studentController";
import { Teachers } from "@/app/api/_controllers/teacherController";
import { Group } from "@/app/types";
import { weeklyTotal } from "@/app/types";

export async function fetchStudentRecords(id: string, limit?:number): Promise<AssociatedStudentRecords> {
    const logPromise = Students.getLogs(id, limit);
    const goalPromise = Students.getGoals(id, limit);
    const resourcePromise = Students.getResources(id, limit);
    const [logs, goals, resources] = (await Promise.all([logPromise, goalPromise, resourcePromise]))
    return {
        logs: logs || [],
        goals: goals || [],
        resources: resources || []
    }
}

export async function fetchCurrentWeekTotal(student_id: string): Promise<weeklyTotal | null> {
    return await Students.getCurrentWeek(student_id);
}
export async function fetchWeekHistory(student_id: string): Promise<weeklyTotal[]> {
    return await Students.getWeekTotals(student_id);
}

export async function fetchUnreadMessages(student_id: string): Promise<number> {
    return await Students.getUnreadMessages(student_id);
}

export async function fetchGroup(teacher_id: string, group_id: string): Promise<Group> {
    return await Teachers.getGroupById(teacher_id, group_id);
}

export async function fetchAllGroups(teacher_id: string): Promise<Group[]> {
    return await Teachers.getAllGroups(teacher_id);
}
