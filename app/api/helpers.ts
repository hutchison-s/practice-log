import { sql } from '@vercel/postgres';
import * as jose from 'jose';

type AccessArguments = {
    req_id?: string | null, content_id?: string | null
}
type AccessRole = 'owner' | 'teacher' | 'owner or teacher';

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

export function isOwner({req_id, content_id}: AccessArguments): boolean {
    if (!req_id || !content_id) return false;
    return req_id == content_id;
}

export async function isTeacher({req_id, content_id}: AccessArguments): Promise<boolean> {
    if (!req_id || !content_id) return false;
    if (req_id == content_id) {
        return false
    };
    try {
        const {rows} = await sql`
            SELECT id 
            FROM students 
            WHERE id = ${content_id} AND teacher_id = ${req_id}
            LIMIT 1;
        `;
        return rows.length > 0;
    } catch (error) {
        console.error('Permission Check Error:', error);
        return false;
    }
}

export async function userIs(role: AccessRole, {req_id, content_id}: AccessArguments): Promise<boolean> {
    if (!role) return false;
    switch(role) {
        case 'owner':
            return isOwner({req_id, content_id});
        case 'teacher':
            return isTeacher({req_id, content_id});
        case 'owner or teacher':
            return isOwner({req_id, content_id}) || isTeacher({req_id, content_id});
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

export async function hasScheduleConflict(teacher_id: string, student_id: string, dow: number, start: string, length: string) {
    const {rowCount} = await sql`
    SELECT 
        name
    FROM 
        students 
    WHERE 
        teacher_id = ${teacher_id}
        AND id != ${student_id}
        AND day_of_week = ${dow}
        AND ${start}::time AT TIME ZONE 'UTC' <= (time_of_day + make_interval(mins => duration))
        AND (${start}::time AT TIME ZONE 'UTC' + make_interval(mins => ${length}::int)) > time_of_day;`
    return rowCount != 0;

}