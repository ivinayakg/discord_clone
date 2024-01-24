import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { createMessage, getChannelMessages } from "~/models/messages.server";
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

  await createMessage(channelId, body.message, user.id);
  return json(
    {
      message: "success",
    },
    201,
  );
}
