import { User } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";

export type LoaderFunctionAuthArgs = LoaderFunctionArgs & {
  userData: User;
};
