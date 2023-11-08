import { currentprofile } from '@/lib/current-profile';
import { NextResponse } from 'next/server';

import { GetObjectCommand, S3Client, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    const profile = await currentprofile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // @ts-ignore
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `/users/${profile.id}/servers/${imageUrl}`,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 60 });

    return NextResponse.json({
      getObjectPreSignedUrl: url,
    });
  } catch (error) {
    console.log('[SERVERS_GET_OBJECT_URL] ', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
