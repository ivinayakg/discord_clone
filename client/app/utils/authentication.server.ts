import { TypedResponse } from "@remix-run/node";
import { requireUser } from "~/session.server";
import { LoaderFunctionAuthArgs } from "~/types/loader";

export function verifyLoginMiddleware(
  loaderFn: (loaderArgs: LoaderFunctionAuthArgs) => Promise<TypedResponse<{}>>,
) {
  return async function (loaderArgs: LoaderFunctionAuthArgs) {
    const { request } = loaderArgs;
    const user = await requireUser(request);
    loaderArgs.userData = user;
    return loaderFn(loaderArgs);
  };
}
