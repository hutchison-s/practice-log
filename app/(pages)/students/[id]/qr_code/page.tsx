import { NextResponse } from 'next/server';
import PrintableQRCode from './PrintableQRCode';
import PageTitle from '@/app/_ui_components/layout/PageTitle';
import BodyText from '@/app/_ui_components/layout/BodyText';
import { Metadata } from 'next';
import { Students } from '@/app/api/_controllers/studentController';

export const metadata: Metadata = {
    title: "Student QR Code",
    description: "Custom student QR Code for easy Practice HQ sign in",
  };

async function QR({params, searchParams}: {params: Promise<{id: string}>, searchParams: Promise<{time: string, code: string}>}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const {time, code} = await searchParams;
    const {id} = await params;
    if (!time || !code) {
        return new NextResponse("Missing parameters", { status: 400 });
    }
    const student = await Students.getOneById(id);
    const qrLink = `${apiURL}/students/${id}/qr_code?code=${code}&time=${time}&width=300`
    

    return (
        <>
            <PageTitle>QR-Code Student Login</PageTitle>
            <div className="w-full max-w-[600px] text-center">
                <BodyText className='my-4'>Print this code and give it to your student. They should keep it with their method books, in their instrument case, or wherever they will see it every time they practice.</BodyText>
                <BodyText className='mb-4'>This code <strong>IS</strong> their login. Students do not log in the same way teachers do.</BodyText>
            </div>
            <PrintableQRCode name={student.name} course={student.subject} imageURL={qrLink} width={300} />
        </>
    )
}

export default QR