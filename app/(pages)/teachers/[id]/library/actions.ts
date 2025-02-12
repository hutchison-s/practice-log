'use server'

import { idType } from "@/app/api/_controllers/parent_classes";
import { Teachers } from "@/app/api/_controllers/teacherController";

const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchStudents(id: idType) {
    return await Teachers.getStudents(id)
}
export async function fetchGroups(id: idType) {
    return await Teachers.getAllGroups(id);
}