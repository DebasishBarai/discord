import { currentprofile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentprofile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await prisma.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentprofile();

    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await prisma.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
