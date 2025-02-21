import { ApprovalRequest, Enrollee, Group, Library, LibraryGoal, LibraryResource, NotificationSettings, StudentWeekReport, User } from "@/app/types";
import { DB_Controller, idType } from "./parent_classes";

export class TeacherController extends DB_Controller<User> {
    constructor() {
        super('/teachers')
    }
    async getStudents(teacher_id: idType) {
        return await this.apiGET<Enrollee[]>(`/${teacher_id}/students`);
    }
    async getGroupById(teacher_id: idType, group_id: idType) {
        return await this.apiGET<Group>(`/${teacher_id}/groups/${group_id}`)
    }
    async getAllGroups(teacher_id: idType) {
        return await this.apiGET<Group[]>(`/${teacher_id}/groups`);
    }
    async getLogReports(teacher_id: idType, limit: number) {
        return await this.apiGET<StudentWeekReport[]>(`/${teacher_id}/reports/logs?limit=${limit}`);
    }
    async getPreferences(teacher_id: idType) {
        return await this.apiGET<NotificationSettings>(`/${teacher_id}/preferences`);
    }
    async getApprovalRequests(teacher_id: idType) {
        return await this.apiGET<ApprovalRequest[]>(`/${teacher_id}/approval_requests`);
    }
    async getLibraryResources(teacher_id: idType) {
        return await this.apiGET<LibraryResource[]>(`/${teacher_id}/library/resources`);
    }
    async getLibraryGoals(teacher_id: idType) {
        return await this.apiGET<LibraryGoal[]>(`/${teacher_id}/library/goals`);
    }
    async getLibrary(teacher_id: idType) {
        return await this.apiGET<Library>(`/${teacher_id}/library`);
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
        async getLogReports({limit}: {limit: number}) {
            return await Teachers.getLogReports(id, limit)
        },
        async getPreferences() {
            return await Teachers.getPreferences(id)
        },
        async getApprovalRequests() {
            return await Teachers.getApprovalRequests(id)
        },
        async getLibraryResources() {
            return await Teachers.getLibraryResources(id);
        },
        async getLibraryGoals() {
            return await Teachers.getLibraryGoals(id);
        },
        async getLibrary() {
            return await Teachers.getLibrary(id);
        }
    }
}

export const Teachers: TeacherController = new TeacherController();