import { sql } from '@vercel/postgres';
import * as jose from 'jose';

type AccessArguments = {
    user_id?: string | null, student_id?: string | null
}
type AccessRole = 'student' | 'teacher' | 'student or teacher';

export async function verifyToken(token: string): Promise<{userId: string, email: string, name: string, iat: number, exp: number} | null> {
    if (!token) {
        console.error('No token provided.');
        return null;
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;
        const secret = new TextEncoder().encode(jwtSecret)
        const {payload}: {payload: {userId: string, email: string, name: string, iat: number, exp: number}} = await jose.jwtVerify(token, secret, {algorithms: ['HS256']});
        return payload;
    } catch (err) {
        const {message} = err as {message: string};
        console.error('JWT Verification Error:', message);
        return null;
    }
}

export function isStudent({user_id, student_id}: AccessArguments): boolean {
    if (!user_id || !student_id) return false;
    return user_id == student_id;
}

export async function isTeacher({user_id, student_id}: AccessArguments): Promise<boolean> {
    if (!user_id || !student_id) return false;
    if (user_id == student_id) {
        return false
    };
    try {
        const {rows} = await sql`
            SELECT id 
            FROM students 
            WHERE id = ${student_id} AND teacher_id = ${user_id}
            LIMIT 1;
        `;
        return rows.length > 0;
    } catch (error) {
        console.error('Permission Check Error:', error);
        return false;
    }
}

export async function userIs(role: AccessRole, {user_id, student_id}: AccessArguments): Promise<boolean> {
    if (!role) return false;
    switch(role) {
        case 'student':
            return isStudent({user_id, student_id});
        case 'teacher':
            return isTeacher({user_id, student_id});
        case 'student or teacher':
            return isStudent({user_id, student_id}) || isTeacher({user_id, student_id});
        default:
            throw new Error('Invalid argument')
    }
}

export async function getRoles(user_id: string | null) {
    if (!user_id) return []
    const roles = []
    const {rows: teachers} = await sql`SELECT id FROM teachers WHERE id = ${user_id}`;
    if (teachers.length > 0) {
        roles.push('teacher')
    }
    const {rows: students} = await sql`SELECT id FROM students WHERE id = ${user_id}`;
    if (students.length > 0) {
        roles.push('student')
    }
    return roles;
}