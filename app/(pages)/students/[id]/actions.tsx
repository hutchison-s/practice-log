'use server'

import { AssociatedStudentRecords } from "@/app/_hooks/studentBrowserReducer";
import { StudentModel } from "@/app/api/_controllers/studentController";
import { Enrollee, User, weeklyTotal } from "@/app/types";

type StudentPageInfo = {
    student: Enrollee,
    records: AssociatedStudentRecords,
    teacher: User,
    weekTotal: weeklyTotal | null,
    report: weeklyTotal[]
}

export async function fetchStudentPageInfo(student_id: string): Promise<StudentPageInfo> {
    const student = await StudentModel(student_id);
    const teacherPromise = student.getTeacher()
    const logsPromise = student.getLogs(5);
    const goalsPromise = student.getGoals(5);
    const resourcesPromise = student.getResources(5);
    const weekPromise = student.getCurrentWeek();
    const reportPromise = student.getWeekTotals();
    const [teacher, logs, goals, resources, weekTotal, report] = await Promise.all([teacherPromise, logsPromise, goalsPromise, resourcesPromise, weekPromise, reportPromise]);
    
    return {
        student: student as Enrollee,
        teacher,
        records: {logs, goals, resources},
        weekTotal,
        report
    }
}