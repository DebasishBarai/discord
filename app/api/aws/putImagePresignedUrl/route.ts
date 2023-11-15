import { currentprofile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
export async function POST(req: Request) {
  try {
    const { serverId, imageUrl, fileType } = await req.json();
    const profile = await currentprofile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //[TODO]: Check the profile is admin of the server with the serverId

    // @ts-ignore
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `/users/${profile.id}/servers/${serverId}/serverImage/${imageUrl}`,
      ContentType: `image/${fileType}`,
    });

    const url = await getSignedUrl(client, command);
    return NextResponse.json({
      putObjectPreSignedUrl: url,
    });
  } catch (error) {
    console.log("[SERVERS_PUT_OBJECT_URL] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
