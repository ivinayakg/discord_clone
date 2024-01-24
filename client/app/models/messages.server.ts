import exp from "constants";
import { prisma } from "~/db.server";

export async function getChannelMessages(channelId: string) {
  return await prisma.message.findMany({
    where: { channel: { id: channelId } },
    include: { author: { select: { id: true, email: true } } },
  });
}

export async function createMessage(
  channelId: string,
  content: string,
  userId: string,
) {
  return await prisma.message.create({
    data: {
      channel: { connect: { id: channelId } },
      content,
      author: { connect: { id: userId } },
    },
  });
}
