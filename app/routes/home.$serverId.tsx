import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, Outlet, useActionData, useLoaderData } from "@remix-run/react";
import ChannelsList from "~/components/Channels";
import { Button } from "~/components/ui/button";
import { getServerChannels } from "~/models/channels.server";
import { getServer } from "~/models/serverInstance.server";
import { JoinServer, isUserMember } from "~/models/user.server";
import { requireUser } from "~/session.server";

export async function loader(args: LoaderFunctionArgs) {
  const user = await requireUser(args.request);

  if (user === undefined) throw redirect("/login");

  const serverId = args.params.serverId;
  if (serverId === undefined) throw redirect("/home");

  if (!(await isUserMember(user?.id, serverId))) {
    return json({
      // permissions: serverPermissions,
      isMember: false,
      server: {},
      channels: [],
      serverId: serverId,
    });
  }

  const server = await getServer(serverId);
  // const serverPermissions = await getServerPermissions(user?.id, serverId);

  const channels = await getServerChannels(serverId);

  return json({
    // permissions: serverPermissions,
    isMember: true,
    server,
    channels,
    serverId: serverId,
  });
}

export async function action(args: ActionFunctionArgs) {
  const formData = await args.request.formData();

  const serverId = args.params.serverId;
  if (serverId === undefined) throw redirect("/home");

  const user = await requireUser(args.request);

  if (!user) return redirect("/login");

  if (formData.get("intent") === "cancel") {
    return redirect("/home");
  } else if (formData.get("intent") === "join") {
    await JoinServer(user.id, serverId);
    return redirect(args.request.url);
  }
}

export default function ServerPage() {
  const loaderData = useLoaderData<typeof loader>();

  if (loaderData.server === undefined) throw redirect("/home");

  return (
    <div className="flex min-w-full min-h-full justify-center items-center">
      {loaderData.isMember === false && <JoinServerForm />}
      {loaderData.isMember === true && (
        <>
          <ChannelsList
            className="w-2/12 min-w-56 h-lvh"
            channels={loaderData.channels}
            serverId={loaderData.serverId}
          />
          <div className="w-10/12">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}

function JoinServerForm() {
  const actionData = useActionData<typeof action>();
  return (
    <Form
      className="bg-secondary w-5/12 p-6 rounded-md mx-auto flex flex-col justify-center items-start gap-2"
      method="post"
    >
      <h3>Would You like to join this Server?</h3>
      <div className="flex justify-start items-center gap-4">
        <Button name="intent" value="cancel">
          Cancel
        </Button>
        <Button name="intent" value="join">
          Join
        </Button>
      </div>
    </Form>
  );
}
