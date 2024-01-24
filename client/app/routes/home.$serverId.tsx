import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import ChannelsList from "~/components/Channels";
import { getServerChannels } from "~/models/channels.server";
import { getServerPermissions } from "~/models/permissions.server";
import { getServer } from "~/models/serverInstance.server";
import { requireUser } from "~/session.server";

export async function loader(args: LoaderFunctionArgs) {
  const user = await requireUser(args.request);

  if (user === undefined) throw redirect("/login");

  const serverId = args.params.serverId;
  if (serverId === undefined) throw redirect("/home");
  const server = await getServer(serverId);
  // const serverPermissions = await getServerPermissions(user?.id, serverId);

  const channels = await getServerChannels(serverId);

  return json({
    // permissions: serverPermissions,
    server,
    channels,
    serverId: serverId,
  });
}

export default function ServerPage() {
  const loaderData = useLoaderData<typeof loader>();

  if (loaderData.server === undefined) throw redirect("/home");

  return (
    <div className="flex min-w-full min-h-full justify-center items-center">
      <ChannelsList
        className="w-2/12 min-w-56 h-lvh"
        channels={loaderData.channels}
        serverId={loaderData.serverId}
      />
      <div className="w-10/12">
        <Outlet />
      </div>
    </div>
  );
}
