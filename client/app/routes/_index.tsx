import type { MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export async function loader() {
  throw redirect("/home");
}

export default function Index() {
  return <>Welcome To Discord Clone</>;
}
