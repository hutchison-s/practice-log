import { sql } from "@vercel/postgres";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    const fd = await request.formData();
    const name = fd.get('name') as string;
    const email = fd.get('email') as string;
    const password = fd.get('password') as string;
    const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);

    // Check if the user already exists
    const existingUsers = await sql`SELECT id FROM teachers WHERE email = ${email}`;
    if (existingUsers.rowCount && existingUsers.rowCount > 0 ) {
        return Response.json({ message: 'User already exists' }, { status: 401 });
    }

    // Hash the password and save the new user
    const hashedPass = await bcrypt.hash(password, saltRounds);
    const newUserResponse = await sql`INSERT INTO teachers (name, email, password) VALUES (${name}, ${email}, ${hashedPass}) RETURNING *`;
    const newUser = newUserResponse.rows[0];


    return Response.json({ message: 'success', data: {id: newUser.id, name, email} }, { status: 201 });
}


