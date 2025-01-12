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
    log?: logRow[],
    day_of_week: string,
    weekly_goal: number,
    teacher_id: string,
    group_id: string | null,
    group_color: string
}

export interface EnrolleeWithCurrentWeekPractice extends Enrollee {
    current_week_minutes: number
}

export type Group = {
    id: string,
    name: string,
    teacher_id: string,
    color: string
}

export type StudentDetails = {
    student: EnrolleeWithCurrentWeekPractice,
    logs: logRow[], 
    goals: Goal[], 
    resources: Resource[], 
    time: number, 
    nextLessonDay: string,
    isLoading: boolean
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

