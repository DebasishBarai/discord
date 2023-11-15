import { currentprofile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  try {
    const { serverId, imageUrl } = await req.json();
    const profile = await currentprofile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await prisma.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });

    if (!server) {
      return new NextResponse("Unauthorised", { status: 401 });
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
      Key: `/users/${server.profileId}/servers/${serverId}/serverImage/${imageUrl}`,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 60 });

    return NextResponse.json({
      getObjectPreSignedUrl: url,
    });
  } catch (error) {
    console.log("[SERVERS_GET_OBJECT_URL] ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
