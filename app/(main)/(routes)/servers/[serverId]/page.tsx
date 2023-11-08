import { currentprofile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { redirectToSignIn } from "@clerk/nextjs";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentprofile();

  if (!profile) {
    return redirectToSignIn();
  }

  // const server = await prisma.server.findUnique({
  //   where: {
  //     id: params.serverId,
  //     members: {
  //       some: {
  //         profileId: profile.id,
  //       },
  //     },
  //   },
  //   include: {
  //     channels: {
  //       where: {
  //         name: "general",
  //       },
  //       orderBy: {
  //         createdAt: "asc",
  //       },
  //     },
  //   },
  // });
  return <div>ServerIdPage</div>;
};

export default ServerIdPage;
