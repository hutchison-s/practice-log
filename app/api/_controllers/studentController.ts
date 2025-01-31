import { Enrollee, User } from "@/app/types";
import { DB_Controller, idType } from "./parent_classes";
import { Teachers } from "./teacherController";
import { GoalController, LogController, MessageController, ResourceController } from "./tableControllers";


export class StudentController extends DB_Controller<Enrollee> {
    constructor() {
        super('/students')
    }
    async getLogs(student_id: idType, limit?: number) {
        const logs = new LogController(student_id);
        return await logs.getSome(limit);
    }
    async getCurrentWeek(student_id: idType) {
        const logs = new LogController(student_id);
        return await logs.getCurrentWeek();
    }
    async getWeekTotals(student_id: idType) {
        const logs = new LogController(student_id);
        return await logs.getWeeks();
    }
    async getResources(student_id: idType, limit?: number) {
        const recs = new ResourceController(student_id);
        return await recs.getSome(limit);
    }
    async getGoals(student_id: idType, limit?: number) {
        const goals = new GoalController(student_id);
        return await goals.getSome(limit);
    }
    async getAllMessages(student_id: idType) {
        const msg = new MessageController(student_id);
        return await msg.getAll();
    }
    async getUnreadMessages(student_id: idType) {
        return await this.apiGET<number>(`/${student_id}/messages/unread`)
    }
}
export const Students: StudentController = new StudentController();

export async function StudentModel(id: idType) {
    const student = await Students.getOneById(id);
    return {
        ...student,
        role: 'student',
        async getTeacher(): Promise<User> {
            return await Teachers.getOneById(student.teacher_id);
        },
        async getLogs(limit?: number) {
            return await Students.getLogs(student.id, limit);
        },
        async getResources(limit?: number) {
            return await Students.getResources(student.id, limit);
        },
        async getGoals(limit?: number) {
            return await Students.getGoals(student.id, limit);
        },
        async getCurrentWeek() {
            return await Students.getCurrentWeek(student.id);
        },
        async getWeekTotals() {
            return await Students.getWeekTotals(student.id);
        },
        async getAllMessages() {
            return await Students.getAllMessages(student.id);
        },
        async getUnreadMessages() {
            return await Students.getUnreadMessages(student.id);
        }
        
    }

}