'use server'

import { fetchJSONWithToken } from "@/app/AuthHandler";
import { logRow, Goal, Resource } from "@/app/types";

function getNextLesson(dow: string): string {
    const nextLesson = new Date();
    while (nextLesson.getDay() != parseInt(dow)) {
        nextLesson.setDate(nextLesson.getDate() + 1);
    }
    return nextLesson.toDateString();
}

function getLessonTime(timestamp: string): number {
    const d = new Date(timestamp);
    return d.getTime();
}

export async function getDetails(id: string, created_at: string, day_of_week: string) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    const {data: logs} = await fetchJSONWithToken<logRow[]>(`${apiURL}/students/${id}/logs?limit=3`);
    const {data: goals} = await fetchJSONWithToken<Goal[]>(`${apiURL}/goals?student_id=${id}`);
    const {data: resources}: {data: Resource[]} = await (await fetch(`${apiURL}/students/${id}/resources`)).json();
    const time = getLessonTime(created_at);
    const nextLessonDay = getNextLesson(day_of_week);
    return {logs, goals, resources, time, nextLessonDay}
}