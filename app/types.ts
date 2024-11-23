import { NextResponse } from "next/server"

export interface User {
    id: string,
    name: string,
    email?: string,
    code?: string
    created_at: string
}

export interface Enrollee extends User {
    total_practice_time: string,
    subject: string,
    log?: logRow[],
    day_of_week: string,
    weekly_goal: string,
}

export interface EnrolleeWithCurrentWeekPractice extends Enrollee {
    current_week_minutes: string
}

export type logRow = {
    log_id: number,
    student_id: number,
    name: string,
    start: string,
    seconds: number,
    journal: string
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

export type apiPayload<T> = {
    message: string,
    data?: T
}
export type apiResponse<T> = Promise<NextResponse<apiPayload<T>>>

