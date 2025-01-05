'use server'

import { sql } from "@vercel/postgres";

export async function validateCode(code: string) {
    try {
        if (!code || typeof code != 'string') throw new Error('Invalid reset code')
        const {rowCount} = await sql`SELECT id FROM reset_codes WHERE code = ${code}`
        if (!rowCount || rowCount == 0) {
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}