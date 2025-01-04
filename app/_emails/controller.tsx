'use server'

import { sql } from "@vercel/postgres";
import { generateRandomString } from "../_functions/generators";

const brevoKey = process.env.BREVO_API_KEY || 'NO_KEY';
type RecipientType = {name: string, email: string}

export async function sendTemplateEmail(to: RecipientType[], templateId: number, params?: Record<string, string>) {
        console.log('sending message');
        const safeContacts = to.map(each => {
            return {name: decodeURIComponent(each.name), email: decodeURIComponent(each.email)}
        })
        await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                "accept": 'application/json',
                'api-key': brevoKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                templateId: templateId,
                to: [...safeContacts],
                params: params || undefined
            })
        }
        ).then(res => res.json())
        .then(body => console.log(body))
        .catch(err => console.error(err))
}

export async function sendWelcomeEmail(recipient: RecipientType) {
    await sendTemplateEmail([{...recipient}], 1);
}

export async function sendValidationEmail(recipient: RecipientType) {
    try {
        const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const {rows} = await sql`INSERT INTO validations (email, code) VALUES (${recipient.email}, ${generateRandomString({length: 20, hyphenBreak: 4})}) RETURNING code`;
        const {code} = rows[0];
        const validationLink = `${apiURL}/auth/validate?code=${code}`;
        await sendTemplateEmail([{...recipient}], 2, {name: recipient.name, validationLink})

    } catch (error) {
        console.error(error);
    }

}

export async function sendPasswordResetEmail(recipient: RecipientType) {
    try {
        const siteURL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
        const {rows} = await sql`INSERT INTO reset_codes (email, code) VALUES (${recipient.email}, ${generateRandomString({length: 20, hyphenBreak: 4})}) RETURNING code`;
        const {code} = rows[0];
        const resetLink = `${siteURL}/password-reset/${code}`;
        await sendTemplateEmail([{...recipient}], 3, {name: recipient.name, resetLink})
    } catch (error) {
        console.error(error);
    }
}

export async function sendConfirmPasswordResetEmail(recipient: RecipientType) {
    await sendTemplateEmail([{...recipient}], 4, {name: recipient.name});
}