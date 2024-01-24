import { Server } from "@prisma/client";
import { prisma } from "~/db.server";

export async function createChannel(serverId: Server["id"], name: string) {
  return await prisma.channel.create({
    data: { server: { connect: { id: serverId } }, name },
  });
}

export async function getServerChannels(serverId: Server["id"]) {
  return await prisma.channel.findMany({ where: { server: { id: serverId } } });
}

export async function getChannelById(channelId: string) {
  return await prisma.channel.findUnique({ where: { id: channelId } });
}
