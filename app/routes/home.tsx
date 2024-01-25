import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, json, useLoaderData } from "@remix-run/react";
import Sidebar from "~/components/Sidebar";
import { ModeToggle } from "~/components/mode-toggle";
import { getUserServers } from "~/models/serverInstance.server";
import { requireUser } from "~/session.server";

export async function loader(args: LoaderFunctionArgs) {
  const userData = await requireUser(args.request);
  const userServers = await getUserServers(userData?.id);
  return json({ message: `success`, servers: userServers });
}

// export const loader = verifyLoginMiddleware(loaderFun);

export default function HomePageRoute() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div className="flex min-w-full min-h-full justify-center items-center">
      <Sidebar className="w-1/12 h-lvh" servers={loaderData.servers}>
        <ModeToggle />
      </Sidebar>

      <div className="w-11/12">
        <Outlet />
      </div>
    </div>
  );
}
