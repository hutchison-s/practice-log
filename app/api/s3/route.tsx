import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const {AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME} = process.env;

// if (!AWS_REGION || !AWS_ACCESS_KEY || !AWS_SECRET_KEY || !AWS_BUCKET_NAME) throw new Error('Missing env')

const client = new S3Client({
    region: AWS_REGION!,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY!,
        secretAccessKey: AWS_SECRET_KEY!
    }
});

function generateHex(length = 20) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
}

function randomInteger(length = 20) {
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(Math.floor(Math.random() * 10));
    }
    return result.join('');
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const file = searchParams.get('file');
    if (!file) {
        return Response.json(
            {message: "File query parameter is required"},
            {status: 400}
        )
    }
    
    const fileName = generateHex(8)+'-'+randomInteger(8)

    const command = new PutObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName
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
        console.log('Deleted');
        return NextResponse.json({message: 'deleted successsfully'}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: 'failed to delete from aws: '+error}, {status: 500})
    }
}