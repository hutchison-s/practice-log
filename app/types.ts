import { NextResponse } from "next/server"

export interface User {
    id: string,
    name: string,
    email?: string,
    code?: string,
    isVerified?: boolean,
    created_at: string
}

export interface Enrollee extends User {
    total_practice_time: string,
    subject: string,
    day_of_week: string,
    time_of_day: string,
    weekly_goal: number,
    teacher_id: string,
    group_id: string | null,
    group_color: string
}

export type Group = {
    id: string,
    name: string,
    teacher_id: string,
    color: string
}

export type logRow = {
    id: string,
    student_id: number,
    name: string,
    start_time: string,
    total_time: string,
    journal: string
  }

export type weeklyTotal = {
    student_id: string,
    lesson_week_start: string,
    weekly_goal: number,
    weekly_total: string
}

export type WeeklyPractice = {
    id: string,
    weekly_goal: string,
    current_week_minutes: string
}

export type Goal = {
    id: string,
    student_id: string,
    created_at: string,
    completed_at: string,
    is_complete: boolean,
    goal_content?: string,
    goal_title: string

}
export type ResourceType = 'audio' | 'video' | 'image' | 'link' | 'pdf';

export type Resource = {
    id: string,
    student_id: string,
    title: string,
    key: string,
    url: string,
    type: string,
    created_at: string
}

export type Message = {
    id: string,
    student_id: string,
    created_at: string,
    content: string,
    is_read: boolean,
    sent_by: string
}

export type apiPayload<T> = {
    message: string,
    data?: T
}
export type apiResponse<T> = Promise<NextResponse<apiPayload<T>>>

export interface StateController<T> {
    add: (x: T)=>void,
    update: (x: T)=>void,
    delete: (x: T)=>void
}