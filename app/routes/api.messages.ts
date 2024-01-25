import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { createMessage, getChannelMessages } from "~/models/messages.server";
import { emitter } from "~/service/emitter.server";
import redisServer from "~/service/redis.server";
import { requireUser } from "~/session.server";

export async function loader(args: LoaderFunctionArgs) {
  const user = await requireUser(args.request);
  const searchParams = new URLSearchParams(args.request.url.split("?")[1]);

  const channelId = searchParams.get("channelId");
  const serverId = searchParams.get("serverId");

  //   is user in server?

  if (channelId === null || serverId === null) {
    return new Response("Bad Request", { status: 400 });
  }

  // redisServer.set

  const messages = await getChannelMessages(channelId);
  return json({
    message: "success",
    data: messages,
  });
}

export async function action(args: ActionFunctionArgs) {
  if (args.request.method !== "POST") {
    return new Response("Bad Request", { status: 400 });
  }
  const user = await requireUser(args.request);

  const body = await args.request.json();
  const channelId = body.channelId;
  const serverId = body.serverId;

  //   is user in server?

  if (channelId === null || serverId === null) {
    return new Response("Bad Request", { status: 400 });
  }

  const message = await createMessage(channelId, serverId, body.message, user.id);
  emitter.emit("message", `${JSON.stringify(message)}`);
  return json(
    {
      message: "success",
    },
    201,
  );
}
