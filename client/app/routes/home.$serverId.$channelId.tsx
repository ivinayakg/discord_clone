import { Message } from "@prisma/client";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { MessageResponse } from "~/types/dtos";

export async function loader(args: LoaderFunctionArgs) {
  const serverId = args.params.serverId;
  const channelId = args.params.channelId;

  if (serverId === undefined || channelId === undefined) {
    return json({ channelId: "", serverId: "" });
  }

  return json({ channelId, serverId });
}

export default function ChannelRoute() {
  const [messages, setMessages] = useState([]);
  const { channelId, serverId } = useLoaderData<typeof loader>();

  useEffect(() => {
    (async () => {
      const messagesRes = await fetch(
        `/api/messages?channelId=${channelId}&serverId=${serverId}`,
      );
      if (messagesRes.status === 200) {
        const messages = await messagesRes.json();
        setMessages(messages.data);
      }
    })();
  }, [channelId, serverId]);

  return (
    <div className="flex flex-col items-center justify-end min-h-lvh w-full p-3">
      <ul className="min-h-full h-10/12 w-full">
        {messages.map((message: MessageResponse) => (
          <MessageCard message={message} key={message.id} />
        ))}
      </ul>
      <SendMessage serverId={serverId} channelId={channelId} />
    </div>
  );
}

function MessageCard({ message }: { message: MessageResponse }) {
  return (
    <>
      <Separator className="mt-1" />
      <div className="flex justify-start items-center gap-4 p-2 w-full">
        <Avatar className="h-10 w-10">
          {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="content">
          <h4>{message.author.email}</h4>
          <p>{message.content}</p>
        </div>
      </div>
    </>
  );
}

function SendMessage({
  serverId,
  channelId,
}: {
  serverId: string;
  channelId: string;
}) {
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message");

    e.preventDefault();

    try {
      const req = await fetch(`/api/messages`, {
        method: "POST",
        body: JSON.stringify({
          serverId,
          channelId,
          message,
        }),
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
      });

      if (req.status === 200) {
        const data = await req.json();
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="bg-secondary h-2/12 w-full p-1 rounded-md mx-auto flex justify-center items-center gap-2 self-end"
      onSubmit={submitHandler}
    >
      <Label className="w-full h-full">
        {/* error handling */}
        {/* {actionData?.errors ? (
            actionData?.errors?.channelName ? (
              <em className="text-red-600">{actionData?.errors.channelName}</em>
            ) : null
          ) : null} */}
        <Input type="text" name="message" placeholder="Message" />
      </Label>
      <Button type="submit" className="h-full">Send</Button>
    </form>
  );
}
