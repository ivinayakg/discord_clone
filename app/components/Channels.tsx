import { ScrollArea } from "./ui/scroll-area";
import { Channel } from "@prisma/client";
import { Separator } from "./ui/separator";
import { Link } from "@remix-run/react";

export default function ChannelsList({
  className,
  channels,
  serverId,
}: {
  className: string;
  channels: any[];
  serverId: string;
}) {
  return (
    <div className={className}>
      <ScrollArea className={"h-full w-full rounded-r-md border"}>
        <div className="p-5 flex flex-col justify-center items-center gap-3">
          <Link
            className="text-left w-full text-xl"
            to={`/home/${serverId}/createchannel`}
          >
            Create Channel +
          </Link>
          <Separator className="my-2" />
          {channels.map((channel: Channel) => (
            <>
              <Link
                className={`text-left w-full text-lg font-semibold bg-secondary p-2 rounded-md opacity-80 hover:opacity-100 transition-all duration-100 `}
                to={`/home/${serverId}/${channel.id}`}
                key={channel.id}
              >
                # {channel.name.slice(1)}
              </Link>
            </>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
