'use server'

import { sql } from "@vercel/postgres";
import { generateRandomString } from "../generators";
import { Teachers } from "@/app/api/_controllers/teacherController";
import WeeklyTeacherReport from "./WeeklyTeacherReport";
import { User } from "@/app/types";

const brevoKey = process.env.BREVO_API_KEY || 'NO_KEY';
type RecipientType = {name: string, email: string}
type teacherInfo = {id: string, name: string, email: string}
type CustomEmailType = {sender: RecipientType, defaultSubject: string, defaultContent: string, messageVersions: {to: RecipientType[], htmlContent: string, subject: string}[]}

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

export async function sendCustomEmail(props: CustomEmailType) {
    await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            "accept": 'application/json',
            'api-key': brevoKey,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            sender: props.sender,
            subject: props.defaultSubject,
            htmlContent: props.defaultContent,
            messageVersions: props.messageVersions
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

export async function sendConfirmDeletedAccountEmail(recipient: RecipientType) {
    await sendTemplateEmail([{...recipient}], 6, {name: recipient.name});
}

export async function getTeachersForWeeklyReport() {
    const {rows, rowCount} = await sql`SELECT t.id, t.name, t.email FROM teachers as t LEFT JOIN account_preferences as ap on ap.user_id = t.id WHERE ap.reports = true AND ap.report_frequency = 7 AND t.validated = true`;
    if (!rowCount || rowCount == 0) return;
    return rows.map(row => row.data) as teacherInfo[]
}

export async function sendWeeklyReport(teachers: teacherInfo[]) {
    
    try {
        const promises = [];
        for (let i = 0; i < teachers.length; i++) {
            promises.push(WeeklyTeacherReport(teachers[i]))
        }
        const reports = await Promise.all(promises);
    
        sendCustomEmail({
            sender: {
                name: 'Practice-HQ',
                email: 'hutchison.music@gmail.com'
            },
            defaultSubject: 'Weekly Practice Report',
            defaultContent: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Weekly Report</title>
                </head>
                <body>
                    <h1>{teacher.name}&apos;s Weekly Practice Report</h1>
                    <p><small>Practice HQ - The essential platform for connecting music lessons and student practice to drive measurable growth.</small></p>
                    <main style="display: flex; width: 100%; flex-wrap: wrap; gap: 1rem;">
                        <p>No practice to report</p>
                    </main>
                </body>
                </html>`,
            messageVersions: teachers.map((t, i) => {
                return {
                    to: [{name: t.name, email: t.email}],
                    htmlContent: reports[i],
                    subject: `Weekly Report for ${t.name} from Practice HQ`
                }
            })
        })
    } catch (error) {
        console.log(error);
    }
};