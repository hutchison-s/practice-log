import { NextResponse } from "next/server"

export interface User {
    id: string,
    name: string,
    email?: string,
    code?: string,
    isVerified?: boolean,
    teacher_id?: string,
    created_at: string,
    timezone: string,
    role: 'teacher' | 'student'
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
    duration: number
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
    journal: string,
    journal_prompt: string
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
    content?: string,
     title: string

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

export type ApprovalRequest = {
    id: string,
    student_id: string,
    student_name: string,
    teacher_id: string,
    log_id: string,
    start_time: string,
    estimated_time: number,
    reason?: string
}

export type NotificationSettings = {
    messages: boolean,
    approvals: boolean,
    reports: boolean,
    report_frequency: number
}

export type StudentWeekReport = {
    student_id: number,
    subject: string,
    name: string;               // The student's name
    day: string;                // The day of the week (e.g., "Monday")
    time: string;               // The time of day in 12-hour format (e.g., "10:00 AM")
    group: string | null;       // The group name the student belongs to, can be null
    week: string;               // The start date of the week in format "Mon DD, YYYY"
    logs: number;          // The count of logs for the student in the week
    goal: number | null; // The weekly goal in minutes, can be null
    mins: number;   // Total practice minutes for the week
    grade: number;            // The percentage of goal achieved (rounded to two decimals)
  };

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