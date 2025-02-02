import { ApprovalRequest, Goal, logRow, Message, Resource, weeklyTotal } from "@/app/types";
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

export const Logs = (id: idType) => new LogController(id);
export const Resources = (id: idType) => new ResourceController(id);
export const Goals = (id: idType) => new GoalController(id);
export const Messages = (id: idType) => new MessageController(id);
