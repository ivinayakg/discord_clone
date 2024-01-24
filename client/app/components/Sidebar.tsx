import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Server } from "@prisma/client";
import { Separator } from "./ui/separator";
import { Link } from "@remix-run/react";

export default function Sidebar({
  className,
  servers,
  children,
}: {
  className: string;
  servers: any[];
  children: any;
}) {
  return (
    <div className={className}>
      <ScrollArea className={"h-full w-full rounded-l-md border "}>
        <div className="p-4 flex flex-col justify-center items-center gap-3">
          {children}
          <Link
            className="flex justify-center items-center text-xl"
            to={`/home/createserver`}
          >
            <Avatar className="h-14 w-14">
              {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
              <AvatarFallback>CR+</AvatarFallback>
            </Avatar>
          </Link>
          <Separator className="my-2" />
          {servers.map((server: Server) => (
            <>
              <Link className="" to={`/home/${server.id}`} key={server.id}>
                <Avatar className="w-14 h-14">
                  {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                  <AvatarFallback asChild>
                    <p className="text-xl">
                      {server.name.slice(0, 2).toUpperCase()}
                    </p>
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function CreateServerIcon() {
  return (
    <svg
      aria-hidden="false"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="w-6 h-6"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21 11H13V3C13 1.89543 12.1046 1 11 1C9.89543 1 9 1.89543 9 3V11H1C0.447715 11 0 11.4477 0 12C0 12.5523 0.447715 13 1 13H9V21C9 22.1046 9.89543 23 11 23C12.1046 23 13 22.1046 13 21V13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11Z"
      ></path>
    </svg>
  );
}
