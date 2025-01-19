import { sendValidationEmail} from "@/app/_utils/emails/controller";
import { sql } from "@vercel/postgres";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    const fd = await request.formData();
    const name = fd.get('name') as string;
    const email = fd.get('email') as string;
    const password = fd.get('password') as string;
    const timezone = fd.get('timezone') as string;
    const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);

    const existingUsers = await sql`SELECT id FROM teachers WHERE email = ${email}`;
    if (existingUsers.rowCount && existingUsers.rowCount > 0 ) {
        return Response.json({ message: 'User already exists' }, { status: 401 });
    }

    const hashedPass = await bcrypt.hash(password, saltRounds);
    const newUserResponse = await sql`INSERT INTO teachers (name, email, password, timezone) VALUES (${name}, ${email}, ${hashedPass}, ${timezone}) RETURNING *`;
    const newUser = newUserResponse.rows[0];
    await sendValidationEmail({email, name});

    return Response.json({ message: 'success', data: {id: newUser.id, name, email} }, { status: 201 });
}


