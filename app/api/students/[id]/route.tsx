import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { apiResponse, Enrollee } from "@/app/types";
import { revalidatePath } from "next/cache";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): apiResponse<Enrollee> {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('-----------no token present in request-----------------------')
        return NextResponse.json({message: 'access denied'}, {status: 401})
    }
    const user = jwt.decode(token, {json: true});
    if (!user) return NextResponse.json({message: 'access denied'}, {status: 401})
    try {
        const id = (await params).id;
        if (!id) throw new Error('No id parameter present');
        const response = await sql`SELECT * FROM students WHERE id = ${id} AND (id = ${user.userId} OR teacher_id = ${user.userId})`;
        return NextResponse.json({message: 'success', data: response.rows[0] as Enrollee}, {status: 200})
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: 'failed'}, {status: 500})
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): apiResponse<Enrollee> {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('-----------no token present in request-----------------------')
        return NextResponse.json({message: 'access denied'}, {status: 401})
    }
    const user = jwt.decode(token, {json: true});
    if (!user) return NextResponse.json({message: 'access denied'}, {status: 401})
    try {
        const id = (await params).id;
        const {name, subject, weeklyGoal, dow} = await request.json();
        if (!id) throw new Error('No id parameter present');
        const response = await sql`UPDATE students SET name = ${name}, subject = ${subject}, weekly_goal = ${weeklyGoal}, day_of_week = ${dow} WHERE id = ${id} AND teacher_id = ${user.userId}`;
        return NextResponse.json({message: 'success', data: response.rows[0] as Enrollee}, {status: 200})
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: 'failed'}, {status: 500})
    }
}

export  async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): apiResponse<undefined> {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({message: 'access denied'}, {status: 401})
    const user = jwt.decode(token, {json: true});
    if (!user) return NextResponse.json({message: 'access denied'}, {status: 401})
    try {
        const id = (await params).id;
        if (!id) throw new Error('No id parameter present');
        await sql`DELETE FROM students WHERE id = ${id} AND teacher_id = ${user.userId}`;
        revalidatePath(`/teachers/${user.userId}`)
        return NextResponse.json({message: 'success'}, {status: 200})
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: 'failed'}, {status: 500})
    }

}