import { sql } from '@vercel/postgres';
import { Download } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { NextResponse } from 'next/server';
import loader from '../../../../_assets/images/loading_qr.png' 
import { Suspense } from 'react';

const apiURL = process.env.NEXT_PUBLIC_API_URL_BASE;

async function QR({params, searchParams}: {params: Promise<{id: string}>, searchParams: Promise<{time: string, code: string}>}) {
    const {time, code} = await searchParams;
    const {id} = await params;
    if (!time || !code) {
        return new NextResponse("Missing parameters", { status: 400 });
    }
    const {rows: names} = await sql`SELECT name FROM students WHERE id = ${id}`;
    const student_name = names[0].name;
    const qrLink = `${apiURL}/students/${id}/qr_code?code=${code}&time=${time}`
    

    return (
        <>
            <Suspense fallback={<Image src={loader} alt='qr code loading...' width={300} height={300}/>}>
                <Image src={qrLink} width={300} height={300} alt='qr code cannot be displayed'/>
            </Suspense>

            <p>{student_name}</p>
            <a href={qrLink} download={`${student_name}-qr-code.png`}><Download/></a>
        </>
    )
}

export default QR