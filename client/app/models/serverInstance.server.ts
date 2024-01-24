import { User, Server } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getUserServers(userId: User["id"]) {
  return await prisma.server.findMany({ where: { owner: { id: userId } } });
}
export async function getServer(serverId: Server["id"]) {
  return await prisma.server.findMany({ where: { id: serverId } });
}

export async function createServerInstance(user: User, name: string) {
  return await prisma.server.create({
    data: { name, owner: { connect: { id: user.id } } },
  });
}
