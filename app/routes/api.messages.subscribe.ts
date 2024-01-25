import { Message } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils/sse/server";
import { emitter } from "~/service/emitter.server";
import redisServer from "~/service/redis.server";
import { requireUser } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  const searchParams = new URLSearchParams(request.url.split("?")[1]);

  const serverId = searchParams.get("serverId");

  if (serverId === null) {
    return new Response("Bad Request", { status: 400 });
  }

  await redisServer.sadd(serverId, user.id);

  return eventStream(request.signal, function setup(send) {
    const userId = user.id;
    async function listener(value: string) {
      const message = JSON.parse(value) as Message;
      const isMember = await redisServer.sismember(message.serverId, userId);
      if (!isMember) {
        return;
      }
      send({
        event: "message",
        data: value,
      });
    }
    emitter.on("message", listener);

    return function cleanup() {
      (async () => {
        await redisServer.srem(serverId, user.id);
      })();
      emitter.off("message", listener);
    };
  });
}
