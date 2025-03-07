import { ApprovalRequest, Goal, Group, logRow, Message, Resource, weeklyTotal } from "@/app/types";
import { DB_Controller, idType } from "./parent_classes";

export class LogController extends DB_Controller<logRow> {
    student_id: idType;
    constructor(student_id: idType) {
        super(`/students/${student_id}/logs`)
        this.student_id = student_id;
    }
    async getCurrentWeek(): Promise<weeklyTotal | null> {
        const weeks = await this.apiGET<weeklyTotal[]>('/week_total?current=true');
        if (weeks.length > 0) return weeks[0];
        else return null;
    }
    async getWeeks(): Promise<weeklyTotal[]> {
        return await this.apiGET<weeklyTotal[]>('/week_total')
    }
    
}

export class ResourceController extends DB_Controller<Resource> {
    student_id: idType;
    constructor(student_id: idType) {
        super(`/students/${student_id}/resources`)
        this.student_id = student_id;
    }
    
}

export class GoalController extends DB_Controller<Goal> {
    student_id: idType
    constructor(student_id: idType) {
        super(`/students/${student_id}/goals`)
        this.student_id = student_id;
    }
    
}

export class MessageController extends DB_Controller<Message> {
    student_id: idType
    constructor(student_id: idType) {
        super(`/students/${student_id}/messages`)
        this.student_id = student_id;
    }
    
}

export class ApprovalRequestController extends DB_Controller<ApprovalRequest> {
    teacher_id: idType
    constructor(teacher_id: idType) {
        super(`/teachers/${teacher_id}/approval_requests`)
        this.teacher_id = teacher_id;
    }
}
export class GroupController extends DB_Controller<Group> {
    teacher_id: idType
    constructor(teacher_id: idType) {
        super(`/teachers/${teacher_id}/groups`)
        this.teacher_id = teacher_id;
    }
}

export const Logs = (student_id: idType) => new LogController(student_id);
export const Resources = (student_id: idType) => new ResourceController(student_id);
export const Goals = (student_id: idType) => new GoalController(student_id);
export const Messages = (student_id: idType) => new MessageController(student_id);
export const Groups = (teacher_id: idType) => new GroupController(teacher_id);
