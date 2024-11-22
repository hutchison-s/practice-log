import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL_BASE;

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}) {
    const searchParams = request.nextUrl.searchParams
    const time = searchParams.get('time');
    const code = searchParams.get('code');
    const {id} = await params;
    if (!time || !code) {
        return new NextResponse("Missing parameters", { status: 400 });
    }
    const qrLink = `${siteURL}/student-login?code=${code}&time=${time}`
    try {
        // Generate the QR code as a data URL (base64 encoded PNG)
    const qrCodeImage = await QRCode.toDataURL(qrLink, {
        width: 300, // Customize QR code dimensions
        margin: 2,  // Customize margin
      });
  
      // Convert the data URL to a binary buffer
      const base64Data = qrCodeImage.split(',')[1];
      const binaryBuffer = Buffer.from(base64Data, 'base64');
  
      // Return the image as a response
      return new Response(binaryBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `inline; filename="qr-code.png"`,
        },
      });
      } catch (error) {
        console.error("Error generating QR code:", error);
        return new NextResponse("Error generating QR code", { status: 500 });
      }
}