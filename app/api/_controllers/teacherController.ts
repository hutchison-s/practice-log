import { ApprovalRequest, Enrollee, Group, NotificationSettings, StudentWeekReport, User } from "@/app/types";
import { DB_Controller, idType } from "./parent_classes";

export class TeacherController extends DB_Controller<User> {
    constructor() {
        super('/teachers')
    }
    async getStudents(teacher_id: idType) {
        return await this.apiCall<Enrollee[]>(`/${teacher_id}/students`);
    }
    async getGroupById(teacher_id: idType, group_id: idType) {
        return await this.apiCall<Group>(`/${teacher_id}/groups/${group_id}`)
    }
    async getAllGroups(teacher_id: idType) {
        return await this.apiCall<Group[]>(`/${teacher_id}/groups`);
    }
    async getLogReports(teacher_id: idType) {
        return await this.apiCall<StudentWeekReport[]>(`/${teacher_id}/reports/logs`);
    }
    async getPreferences(teacher_id: idType) {
        return await this.apiCall<NotificationSettings>(`/${teacher_id}/preferences`);
    }
    async getApprovalRequests(teacher_id: idType) {
        return await this.apiCall<ApprovalRequest[]>(`${teacher_id}/approval_requests`);
    }
}

export async function TeacherModel(id: string | number) {
    const {name, email, isVerified, created_at, timezone} = await Teachers.getOneById(id);
    
    return {
        name, email,isVerified, created_at, timezone,
        role: 'teacher',
        async getStudents(): Promise<Enrollee[]> {
            return await Teachers.getStudents(id);
        },
        async getGroupById(group_id: idType) {
            return await Teachers.getGroupById(id, group_id)
        },
        async getAllGroups() {
            return await Teachers.getAllGroups(id)
        },
        async getLogReports() {
            return await Teachers.getLogReports(id)
        },
        async getPreferences() {
            return await Teachers.getPreferences(id)
        },
        async getApprovalRequests() {
            return await Teachers.getApprovalRequests(id)
        },
    }
}

export const Teachers: TeacherController = new TeacherController();