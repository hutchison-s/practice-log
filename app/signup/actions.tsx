'use server'

export default async function sendWelcomeEmail(recipient: {name: string, email: string}) {

        const my_key = process.env.BREVO_API_KEY || 'NO_KEY';
        console.log('sending message')
        await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                "accept": 'application/json',
                'api-key': my_key,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                templateId: 1,
                to: [
                    {name: decodeURIComponent(recipient.name), email: decodeURIComponent(recipient.email)}
                ]
            })
        }
        ).then(res => res.json())
        .then(body => console.log(body))
        .catch(err => console.error(err))

}