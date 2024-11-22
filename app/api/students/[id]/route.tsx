import { sql } from "@vercel/postgres";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('-----------no token present in request-----------------------')
        return new Response(JSON.stringify({message: 'access denied'}), {status: 401})
    }
    const user = jwt.decode(token, {json: true});
    if (!user) return new Response(JSON.stringify({message: 'access denied'}), {status: 401})
    try {
        const id = (await params).id;
        if (!id) throw new Error('No id parameter present');
        const response = await sql`SELECT * FROM students WHERE id = ${id} AND (id = ${user.userId} OR teacher_id = ${user.userId})`;
        return new Response(JSON.stringify({message: 'success', data: response.rows[0]}), {status: 200})
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({message: 'failed'}), {status: 500})
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.error('-----------no token present in request-----------------------')
        return new Response(JSON.stringify({message: 'access denied'}), {status: 401})
    }
    const user = jwt.decode(token, {json: true});
    if (!user) return new Response(JSON.stringify({message: 'access denied'}), {status: 401})
    try {
        const id = (await params).id;
        const {name, subject, weeklyGoal, dow} = await request.json();
        if (!id) throw new Error('No id parameter present');
        const response = await sql`UPDATE students SET name = ${name}, subject = ${subject}, weekly_goal = ${weeklyGoal}, day_of_week = ${dow} WHERE id = ${id} AND teacher_id = ${user.userId}`;
        return new Response(JSON.stringify({message: 'success', data: response.rows[0]}), {status: 200})
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({message: 'failed'}), {status: 500})
    }
}

export  async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = request.cookies.get('token')?.value;
    if (!token) return new Response(JSON.stringify({message: 'access denied'}), {status: 401})
    const user = jwt.decode(token, {json: true});
    if (!user) return new Response(JSON.stringify({message: 'access denied'}), {status: 401})
    try {
        const id = (await params).id;
        if (!id) throw new Error('No id parameter present');
        await sql`DELETE FROM students WHERE id = ${id} AND teacher_id = ${user.userId}`;
        return new Response(JSON.stringify({message: 'success'}), {status: 200})
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({message: 'failed'}), {status: 500})
    }

}