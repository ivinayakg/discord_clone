import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Form, useActionData } from "@remix-run/react";
import { Label } from "~/components/ui/label";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { requireUser } from "~/session.server";
import { createServerInstance } from "~/models/serverInstance.server";
import { createPermission } from "~/models/permissions.server";
// import { User } from "@prisma/client";

export async function action(args: ActionFunctionArgs) {
  const formData = await args.request.formData();

  const serverName = formData.get("serverName");

  if (serverName === null || typeof serverName !== "string") {
    return json({ errors: { serverName: "Server name is required" } });
  }

  const user = await requireUser(args.request);
  if (!user) return redirect("/login");
  const server = await createServerInstance(user, serverName);
  await createPermission(user.id, server.id, "ADMIN");

  return redirect(`/home/${server.id}`);
}

export default function CreateServer() {
  const actionData = useActionData<typeof action>();
  return (
    <Form className="bg-secondary w-5/12 p-6 rounded-md mx-auto" method="post">
      <p className="mb-4">
        <Label>
          Server Name:{" "}
          {actionData?.errors ? (
            actionData?.errors?.serverName ? (
              <em className="text-red-600">{actionData?.errors.serverName}</em>
            ) : null
          ) : null}
          <Input
            type="text"
            name="serverName"
            placeholder="Server Name"
            className="mt-2"
          />
        </Label>
      </p>
      <Button>Create Server</Button>
    </Form>
  );
}
