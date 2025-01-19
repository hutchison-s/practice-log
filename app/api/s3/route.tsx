import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { generateHex, randomInteger } from "@/app/_utils/generators";

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY_ID = process.env.AWS_SECRET_KEY_ID;
const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_KEY_ID || !AWS_BUCKET_NAME) throw new Error('Missing env')

const client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_KEY_ID
    }
});



export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const file = searchParams.get('file');
    const size = searchParams.get('size');
    if (!file || !size) {
        return Response.json(
            {message: "File query parameter is required"},
            {status: 400}
        )
    }
    
    const fileName = generateHex(8)+'-'+randomInteger(8)

    const command = new PutObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
        ContentLength: parseFloat(size)
    });

    const url = await getSignedUrl(client, command, {expiresIn: 60});

    return Response.json({message: 'success', data: {key: fileName, url, downloadURL: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`}})
}

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('file');
    if (!name) {
        return Response.json(
            {message: "File name parameter is required"},
            {status: 400}
        )
    }
    const command = new DeleteObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: name
    })

    try {
        await client.send(command);
        return NextResponse.json({message: 'deleted successsfully'}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'failed to delete from aws: '+error}, {status: 500})
    }
}