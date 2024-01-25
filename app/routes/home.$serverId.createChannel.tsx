import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Form, useActionData } from "@remix-run/react";
import { Label } from "~/components/ui/label";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { requireUser } from "~/session.server";
import { getServerPermissions } from "~/models/permissions.server";
import { createChannel } from "~/models/channels.server";

export async function action(args: ActionFunctionArgs) {
  const formData = await args.request.formData();

  const user = await requireUser(args.request);
  if (!user) return redirect("/login");

  if (args?.params?.serverId === undefined) {
    return json({
      errors: { message: "Server id is required", channelName: null },
    });
  }

  const userPermissions = await getServerPermissions(
    user.id,
    args.params.serverId,
    ["ADMIN", "MODERATOR"],
  );

  if (!userPermissions) {
    return json({
      errors: {
        message: "You do not have permission to create a channel",
        channelName: null,
      },
    });
  }

  const channelName = formData.get("channelName");

  if (channelName === null || typeof channelName !== "string") {
    return json({ errors: { channelName: "Channel name is required" } });
  }

  const channel = await createChannel(args.params.serverId, channelName);

  return redirect(`/home/${args.params.serverId}/${channel.id}`);
}

export default function Createchannel() {
  const actionData = useActionData<typeof action>();
  return (
    <Form className="bg-secondary w-5/12 p-6 rounded-md mx-auto" method="post">
      <p className="mb-4">
        <Label>
          Channel Name:{" "}
          {actionData?.errors ? (
            actionData?.errors?.channelName ? (
              <em className="text-red-600">{actionData?.errors.channelName}</em>
            ) : null
          ) : null}
          <Input
            type="text"
            name="channelName"
            placeholder="Channel Name"
            className="mt-2"
          />
        </Label>
      </p>
      <Button>Create Channel</Button>
    </Form>
  );
}
