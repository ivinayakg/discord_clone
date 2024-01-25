import { Role, Server, User } from "@prisma/client";
import { prisma } from "~/db.server";

export async function createPermission(
  userId: User["id"],
  serverId: Server["id"],
  role: Role,
) {
  return await prisma.permission.create({
    data: {
      user: { connect: { id: userId } },
      server: { connect: { id: serverId } },
      role: role,
    },
  });
}

export async function getServerPermissions(
  userId: User["id"],
  serverId: Server["id"],
  roles: Role[],
) {
  return await prisma.permission.findMany({
    where: {
      server: { id: serverId },
      user: { id: userId },
      role: { in: roles },
    },
  });
}
