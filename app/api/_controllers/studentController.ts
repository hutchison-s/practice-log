import { Enrollee, User } from "@/app/types";
import { DB_Controller, idType } from "./parent_classes";
import { Teachers } from "./teacherController";
import { Goals, Logs, Messages, Resources } from "./tableControllers";


export class StudentController extends DB_Controller<Enrollee> {
    constructor() {
        super('/students')
    }
    async getLogs(student_id: idType, limit?: number) {
        return await Logs(student_id).getSome(limit);
    }
    async getCurrentWeek(student_id: idType) {
        return await Logs(student_id).getCurrentWeek();
    }
    async getWeekTotals(student_id: idType) {
        return await Logs(student_id).getWeeks();
    }
    async getResources(student_id: idType, limit?: number) {
        return await Resources(student_id).getSome(limit);
    }
    async getGoals(student_id: idType, limit?: number) {
        return await Goals(student_id).getSome(limit);
    }
    async getAllMessages(student_id: idType) {
        return await Messages(student_id).getAll();
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