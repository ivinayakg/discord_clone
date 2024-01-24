var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  mode: () => mode,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_node_stream = require("node:stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_jsx_runtime = require("react/jsx-runtime"), ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return (0, import_isbot.default)(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let { abort, pipe } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react.RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          let body = new import_node_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response((0, import_node.createReadableStreamFromReadable)(body), {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let { abort, pipe } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react.RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          let body = new import_node_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response((0, import_node.createReadableStreamFromReadable)(body), {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          console.error(error), responseStatusCode = 500;
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  App: () => App,
  default: () => AppWithProviders,
  links: () => links,
  loader: () => loader
});
var import_clsx = __toESM(require("clsx"));
var import_node3 = require("@remix-run/node"), import_react2 = require("@remix-run/react"), import_remix_themes2 = require("remix-themes");

// app/session.server.ts
var import_node2 = require("@remix-run/node"), import_tiny_invariant = __toESM(require("tiny-invariant")), import_remix_themes = require("remix-themes");

// app/models/user.server.ts
var import_bcryptjs = __toESM(require("bcryptjs"));

// app/db.server.ts
var import_client = require("@prisma/client");

// app/singleton.server.ts
var singleton = (name, valueFactory) => {
  let g = global;
  return g.__singletons ??= {}, g.__singletons[name] ??= valueFactory(), g.__singletons[name];
};

// app/db.server.ts
var prisma = singleton("prisma", () => new import_client.PrismaClient());
prisma.$connect();

// app/models/user.server.ts
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
async function createUser(email, password) {
  let hashedPassword = await import_bcryptjs.default.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });
}
async function verifyLogin(email, password) {
  let userWithPassword = await prisma.user.findUnique({
    where: { email }
  });
  if (!userWithPassword || !userWithPassword.password || !await import_bcryptjs.default.compare(password, userWithPassword.password))
    return null;
  let { password: _password, ...userWithoutPassword } = userWithPassword;
  return userWithoutPassword;
}

// app/session.server.ts
(0, import_tiny_invariant.default)(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
var sessionStorage = (0, import_node2.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: !0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: !0
  }
}), USER_SESSION_KEY = "userId";
async function getSession(request) {
  let cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
async function getUserId(request) {
  return (await getSession(request)).get(USER_SESSION_KEY);
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (userId === void 0)
    return null;
  let user = await getUserById(userId);
  if (user)
    return user;
  throw await logout(request);
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  let userId = await getUserId(request);
  if (!userId) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw (0, import_node2.redirect)(`/login?${searchParams}`);
  }
  return userId;
}
async function requireUser(request) {
  let userId = await requireUserId(request), user = await getUserById(userId);
  if (user)
    return user;
  throw await logout(request);
}
async function createUserSession({
  request,
  userId,
  remember,
  redirectTo
}) {
  let session = await getSession(request);
  return session.set(USER_SESSION_KEY, userId), (0, import_node2.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  });
}
async function logout(request) {
  let session = await getSession(request);
  return (0, import_node2.redirect)("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}
var themeSessionResolver = (0, import_remix_themes.createThemeSessionResolver)(sessionStorage);

// app/tailwind.css
var tailwind_default = "/build/_assets/tailwind-4SWCXOEN.css";

// app/root.tsx
var import_jsx_runtime2 = require("react/jsx-runtime"), loader = async ({ request }) => {
  let { getTheme } = await themeSessionResolver(request);
  return (0, import_node3.json)({ user: await getUser(request), theme: getTheme() });
}, links = () => [
  { rel: "stylesheet", href: tailwind_default },
  ...void 0 ? [{ rel: "stylesheet", href: void 0 }] : []
];
function AppWithProviders() {
  let data = (0, import_react2.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remix_themes2.ThemeProvider, { specifiedTheme: data.theme, themeAction: "/action/set-theme", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(App, {}) });
}
function App() {
  let data = (0, import_react2.useLoaderData)(), [theme] = (0, import_remix_themes2.useTheme)();
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("html", { lang: "en", className: (0, import_clsx.default)(theme), children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Meta, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_remix_themes2.PreventFlashOnWrongTheme, { ssrTheme: Boolean(data.theme) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Links, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("body", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Outlet, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.ScrollRestoration, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Scripts, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.LiveReload, {})
    ] })
  ] });
}

// app/routes/home.$serverId.createChannel.tsx
var home_serverId_createChannel_exports = {};
__export(home_serverId_createChannel_exports, {
  action: () => action,
  default: () => Createchannel
});

// app/components/ui/button.tsx
var React = __toESM(require("react")), import_react_slot = require("@radix-ui/react-slot"), import_class_variance_authority = require("class-variance-authority");

// app/lib/utils.ts
var import_clsx2 = require("clsx"), import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx2.clsx)(inputs));
}

// app/components/ui/button.tsx
var import_jsx_runtime3 = require("react/jsx-runtime"), buttonVariants = (0, import_class_variance_authority.cva)(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), Button = React.forwardRef(
  ({ className, variant, size, asChild = !1, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    asChild ? import_react_slot.Slot : "button",
    {
      className: cn(buttonVariants({ variant, size, className })),
      ref,
      ...props
    }
  )
);
Button.displayName = "Button";

// app/components/ui/input.tsx
var React2 = __toESM(require("react"));
var import_jsx_runtime4 = require("react/jsx-runtime"), Input = React2.forwardRef(
  ({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "input",
    {
      type,
      className: cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props
    }
  )
);
Input.displayName = "Input";

// app/routes/home.$serverId.createChannel.tsx
var import_react3 = require("@remix-run/react");

// app/components/ui/label.tsx
var React3 = __toESM(require("react")), LabelPrimitive = __toESM(require("@radix-ui/react-label")), import_class_variance_authority2 = require("class-variance-authority");
var import_jsx_runtime5 = require("react/jsx-runtime"), labelVariants = (0, import_class_variance_authority2.cva)(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
), Label = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;

// app/routes/home.$serverId.createChannel.tsx
var import_node4 = require("@remix-run/node");

// app/models/permissions.server.ts
async function createPermission(userId, serverId, role) {
  return await prisma.permission.create({
    data: {
      user: { connect: { id: userId } },
      server: { connect: { id: serverId } },
      role
    }
  });
}
async function getServerPermissions(userId, serverId, roles) {
  return await prisma.permission.findMany({
    where: {
      server: { id: serverId },
      user: { id: userId },
      role: { in: roles }
    }
  });
}

// app/models/channels.server.ts
async function createChannel(serverId, name) {
  return await prisma.channel.create({
    data: { server: { connect: { id: serverId } }, name }
  });
}
async function getServerChannels(serverId) {
  return await prisma.channel.findMany({ where: { server: { id: serverId } } });
}

// app/routes/home.$serverId.createChannel.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
async function action(args) {
  let formData = await args.request.formData(), user = await requireUser(args.request);
  if (!user)
    return (0, import_node4.redirect)("/login");
  if (args?.params?.serverId === void 0)
    return (0, import_node4.json)({
      errors: { message: "Server id is required", channelName: null }
    });
  if (!await getServerPermissions(
    user.id,
    args.params.serverId,
    ["ADMIN", "MODERATOR"]
  ))
    return (0, import_node4.json)({
      errors: {
        message: "You do not have permission to create a channel",
        channelName: null
      }
    });
  let channelName = formData.get("channelName");
  if (channelName === null || typeof channelName != "string")
    return (0, import_node4.json)({ errors: { channelName: "Channel name is required" } });
  let channel = await createChannel(args.params.serverId, channelName);
  return (0, import_node4.redirect)(`/home/${args.params.serverId}/${channel.id}`);
}
function Createchannel() {
  let actionData = (0, import_react3.useActionData)();
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_react3.Form, { className: "bg-secondary w-5/12 p-6 rounded-md mx-auto", method: "post", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "mb-4", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Label, { children: [
      "Channel Name:",
      " ",
      actionData?.errors && actionData?.errors?.channelName ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("em", { className: "text-red-600", children: actionData?.errors.channelName }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        Input,
        {
          type: "text",
          name: "channelName",
          placeholder: "Channel Name",
          className: "mt-2"
        }
      )
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Button, { children: "Create Channel" })
  ] });
}

// app/routes/home.$serverId.$channelId.tsx
var home_serverId_channelId_exports = {};
__export(home_serverId_channelId_exports, {
  default: () => ChannelRoute,
  loader: () => loader2
});
var import_node5 = require("@remix-run/node"), import_react4 = require("@remix-run/react"), import_react5 = require("react");

// app/components/ui/avatar.tsx
var React4 = __toESM(require("react")), AvatarPrimitive = __toESM(require("@radix-ui/react-avatar"));
var import_jsx_runtime7 = require("react/jsx-runtime"), Avatar = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
var AvatarImage = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
var AvatarFallback = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// app/components/ui/separator.tsx
var React5 = __toESM(require("react")), SeparatorPrimitive = __toESM(require("@radix-ui/react-separator"));
var import_jsx_runtime8 = require("react/jsx-runtime"), Separator = React5.forwardRef(
  ({ className, orientation = "horizontal", decorative = !0, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

// app/routes/home.$serverId.$channelId.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
async function loader2(args) {
  let serverId = args.params.serverId, channelId = args.params.channelId;
  return serverId === void 0 || channelId === void 0 ? (0, import_node5.json)({ channelId: "", serverId: "" }) : (0, import_node5.json)({ channelId, serverId });
}
function ChannelRoute() {
  let [messages, setMessages] = (0, import_react5.useState)([]), { channelId, serverId } = (0, import_react4.useLoaderData)();
  return (0, import_react5.useEffect)(() => {
    (async () => {
      let messagesRes = await fetch(
        `/api/messages?channelId=${channelId}&serverId=${serverId}`
      );
      if (messagesRes.status === 200) {
        let messages2 = await messagesRes.json();
        setMessages(messages2.data);
      }
    })();
  }, [channelId, serverId]), /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex flex-col items-center justify-end min-h-lvh w-full p-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("ul", { className: "min-h-full h-10/12 w-full", children: messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(MessageCard, { message }, message.id)) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SendMessage, { serverId, channelId })
  ] });
}
function MessageCard({ message }) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Separator, { className: "mt-1" }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex justify-start items-center gap-4 p-2 w-full", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Avatar, { className: "h-10 w-10", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(AvatarFallback, { children: "IN" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "content", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h4", { children: message.author.email }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { children: message.content })
      ] })
    ] })
  ] });
}
function SendMessage({
  serverId,
  channelId
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    "form",
    {
      className: "bg-secondary h-2/12 w-full p-1 rounded-md mx-auto flex justify-center items-center gap-2 self-end",
      onSubmit: async (e) => {
        let message = new FormData(e.currentTarget).get("message");
        e.preventDefault();
        try {
          let req = await fetch("/api/messages", {
            method: "POST",
            body: JSON.stringify({
              serverId,
              channelId,
              message
            }),
            headers: {
              "Content-Type": "application/json",
              credentials: "include"
            }
          });
          if (req.status === 200) {
            let data = await req.json();
            console.log(data);
          }
        } catch (error) {
          console.log(error);
        }
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { className: "w-full h-full", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Input, { type: "text", name: "message", placeholder: "Message" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Button, { type: "submit", className: "h-full", children: "Send" })
      ]
    }
  );
}

// app/routes/home.createserver.tsx
var home_createserver_exports = {};
__export(home_createserver_exports, {
  action: () => action2,
  default: () => CreateServer
});
var import_react6 = require("@remix-run/react");
var import_node6 = require("@remix-run/node");

// app/models/serverInstance.server.ts
async function getUserServers(userId) {
  return await prisma.server.findMany({ where: { owner: { id: userId } } });
}
async function getServer(serverId) {
  return await prisma.server.findMany({ where: { id: serverId } });
}
async function createServerInstance(user, name) {
  return await prisma.server.create({
    data: { name, owner: { connect: { id: user.id } } }
  });
}

// app/routes/home.createserver.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
async function action2(args) {
  let serverName = (await args.request.formData()).get("serverName");
  if (serverName === null || typeof serverName != "string")
    return (0, import_node6.json)({ errors: { serverName: "Server name is required" } });
  let user = await requireUser(args.request);
  if (!user)
    return (0, import_node6.redirect)("/login");
  let server = await createServerInstance(user, serverName);
  return await createPermission(user.id, server.id, "ADMIN"), (0, import_node6.redirect)(`/home/${server.id}`);
}
function CreateServer() {
  let actionData = (0, import_react6.useActionData)();
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_react6.Form, { className: "bg-secondary w-5/12 p-6 rounded-md mx-auto", method: "post", children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "mb-4", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(Label, { children: [
      "Server Name:",
      " ",
      actionData?.errors && actionData?.errors?.serverName ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("em", { className: "text-red-600", children: actionData?.errors.serverName }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        Input,
        {
          type: "text",
          name: "serverName",
          placeholder: "Server Name",
          className: "mt-2"
        }
      )
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Button, { children: "Create Server" })
  ] });
}

// app/routes/action.set-theme.ts
var action_set_theme_exports = {};
__export(action_set_theme_exports, {
  action: () => action3
});
var import_remix_themes3 = require("remix-themes");
var action3 = (0, import_remix_themes3.createThemeAction)(themeSessionResolver);

// app/routes/home.$serverId.tsx
var home_serverId_exports = {};
__export(home_serverId_exports, {
  default: () => ServerPage,
  loader: () => loader3
});
var import_node7 = require("@remix-run/node"), import_react8 = require("@remix-run/react");

// app/components/ui/scroll-area.tsx
var React6 = __toESM(require("react")), ScrollAreaPrimitive = __toESM(require("@radix-ui/react-scroll-area"));
var import_jsx_runtime11 = require("react/jsx-runtime"), ScrollArea = React6.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(ScrollBar, {}),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
var ScrollBar = React6.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

// app/components/Channels.tsx
var import_react7 = require("@remix-run/react"), import_jsx_runtime12 = require("react/jsx-runtime");
function ChannelsList({
  className,
  channels,
  serverId
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ScrollArea, { className: "h-full w-full rounded-r-md border", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "p-5 flex flex-col justify-center items-center gap-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      import_react7.Link,
      {
        className: "text-left w-full text-xl",
        to: `/home/${serverId}/createchannel`,
        children: "Create Channel +"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Separator, { className: "my-2" }),
    channels.map((channel) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_jsx_runtime12.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
      import_react7.Link,
      {
        className: "text-left w-full text-lg font-semibold bg-secondary p-2 rounded-md opacity-80 hover:opacity-100 transition-all duration-100 ",
        to: `/home/${serverId}/${channel.id}`,
        children: [
          "# ",
          channel.name.slice(1)
        ]
      },
      channel.id
    ) }))
  ] }) }) });
}

// app/routes/home.$serverId.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
async function loader3(args) {
  if (await requireUser(args.request) === void 0)
    throw (0, import_node7.redirect)("/login");
  let serverId = args.params.serverId;
  if (serverId === void 0)
    throw (0, import_node7.redirect)("/home");
  let server = await getServer(serverId), channels = await getServerChannels(serverId);
  return (0, import_node7.json)({
    // permissions: serverPermissions,
    server,
    channels,
    serverId
  });
}
function ServerPage() {
  let loaderData = (0, import_react8.useLoaderData)();
  if (loaderData.server === void 0)
    throw (0, import_node7.redirect)("/home");
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex min-w-full min-h-full justify-center items-center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      ChannelsList,
      {
        className: "w-2/12 min-w-56 h-lvh",
        channels: loaderData.channels,
        serverId: loaderData.serverId
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "w-10/12", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_react8.Outlet, {}) })
  ] });
}

// app/routes/api.messages.ts
var api_messages_exports = {};
__export(api_messages_exports, {
  action: () => action4,
  loader: () => loader4
});
var import_node8 = require("@remix-run/node");

// app/models/messages.server.ts
async function getChannelMessages(channelId) {
  return await prisma.message.findMany({
    where: { channel: { id: channelId } },
    include: { author: { select: { id: !0, email: !0 } } }
  });
}
async function createMessage(channelId, content, userId) {
  return await prisma.message.create({
    data: {
      channel: { connect: { id: channelId } },
      content,
      author: { connect: { id: userId } }
    }
  });
}

// app/routes/api.messages.ts
async function loader4(args) {
  let user = await requireUser(args.request), searchParams = new URLSearchParams(args.request.url.split("?")[1]), channelId = searchParams.get("channelId"), serverId = searchParams.get("serverId");
  if (channelId === null || serverId === null)
    return new Response("Bad Request", { status: 400 });
  let messages = await getChannelMessages(channelId);
  return (0, import_node8.json)({
    message: "success",
    data: messages
  });
}
async function action4(args) {
  if (args.request.method !== "POST")
    return new Response("Bad Request", { status: 400 });
  let user = await requireUser(args.request), body = await args.request.json(), channelId = body.channelId, serverId = body.serverId;
  return channelId === null || serverId === null ? new Response("Bad Request", { status: 400 }) : (await createMessage(channelId, body.message, user.id), (0, import_node8.json)(
    {
      message: "success"
    },
    201
  ));
}

// app/routes/healthcheck.tsx
var healthcheck_exports = {};
__export(healthcheck_exports, {
  loader: () => loader5
});
var loader5 = async ({ request }) => {
  let host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  try {
    let url = new URL("/", `http://${host}`);
    return await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok)
          return Promise.reject(r);
      })
    ]), new Response("OK");
  } catch (error) {
    return console.log("healthcheck \u274C", { error }), new Response("ERROR", { status: 500 });
  }
};

// app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action5,
  loader: () => loader6
});
var import_node9 = require("@remix-run/node");
var action5 = async ({ request }) => logout(request), loader6 = async () => (0, import_node9.redirect)("/");

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index,
  loader: () => loader7,
  meta: () => meta
});
var import_react9 = require("@remix-run/react"), import_jsx_runtime14 = require("react/jsx-runtime"), meta = () => [{ title: "Remix Notes" }];
async function loader7() {
  throw (0, import_react9.redirect)("/home");
}
function Index() {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_jsx_runtime14.Fragment, { children: "Welcome To Discord Clone" });
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action6,
  default: () => LoginPage,
  loader: () => loader8,
  meta: () => meta2
});
var import_node10 = require("@remix-run/node"), import_react12 = require("@remix-run/react"), import_react13 = require("react");

// app/components/mode-toggle.tsx
var import_lucide_react2 = require("lucide-react"), import_remix_themes4 = require("remix-themes");

// app/components/ui/dropdown-menu.tsx
var React7 = __toESM(require("react")), DropdownMenuPrimitive = __toESM(require("@radix-ui/react-dropdown-menu")), import_lucide_react = require("lucide-react");
var import_jsx_runtime15 = require("react/jsx-runtime"), DropdownMenu = DropdownMenuPrimitive.Root, DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React7.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react.ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React7.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React7.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React7.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react.Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react.Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React7.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({
  className,
  ...props
}) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
  "span",
  {
    className: cn("ml-auto text-xs tracking-widest opacity-60", className),
    ...props
  }
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// app/components/mode-toggle.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
function ModeToggle() {
  let [, setTheme] = (0, import_remix_themes4.useTheme)();
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(DropdownMenu, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuTrigger, { asChild: !0, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(Button, { variant: "ghost", size: "icon", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react2.Sun, { className: "h-[2.4rem] w-[2.4rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(import_lucide_react2.Moon, { className: "absolute h-[2.4rem] w-[2.4rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "sr-only", children: "Toggle theme" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(DropdownMenuContent, { align: "end", children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuItem, { onClick: () => setTheme(import_remix_themes4.Theme.LIGHT), children: "Light" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(DropdownMenuItem, { onClick: () => setTheme(import_remix_themes4.Theme.DARK), children: "Dark" })
    ] })
  ] });
}

// app/utils.ts
var import_react10 = require("@remix-run/react"), import_react11 = require("react"), DEFAULT_REDIRECT = "/";
function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  return !to || typeof to != "string" || !to.startsWith("/") || to.startsWith("//") ? defaultRedirect : to;
}
function validateEmail(email) {
  return typeof email == "string" && email.length > 3 && email.includes("@");
}

// app/routes/login.tsx
var import_jsx_runtime17 = require("react/jsx-runtime"), loader8 = async ({ request }) => await getUserId(request) ? (0, import_node10.redirect)("/") : (0, import_node10.json)({}), action6 = async ({ request }) => {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/"), remember = formData.get("remember");
  if (!validateEmail(email))
    return (0, import_node10.json)(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  if (typeof password != "string" || password.length === 0)
    return (0, import_node10.json)(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  if (password.length < 8)
    return (0, import_node10.json)(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  let user = await verifyLogin(email, password);
  return user ? createUserSession({
    redirectTo,
    remember: remember === "on",
    request,
    userId: user.id
  }) : (0, import_node10.json)(
    { errors: { email: "Invalid email or password", password: null } },
    { status: 400 }
  );
}, meta2 = () => [{ title: "Login" }];
function LoginPage() {
  let [searchParams] = (0, import_react12.useSearchParams)(), redirectTo = searchParams.get("redirectTo") || "/notes", actionData = (0, import_react12.useActionData)(), emailRef = (0, import_react13.useRef)(null), passwordRef = (0, import_react13.useRef)(null);
  return (0, import_react13.useEffect)(() => {
    actionData?.errors?.email ? emailRef.current?.focus() : actionData?.errors?.password && passwordRef.current?.focus();
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex min-h-full flex-col justify-center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(ModeToggle, {}),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "mx-auto w-full max-w-md px-8", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(import_react12.Form, { method: "post", className: "space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
          "label",
          {
            htmlFor: "email",
            className: "block text-sm font-medium text-gray-700",
            children: "Email address"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "mt-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            "input",
            {
              ref: emailRef,
              id: "email",
              required: !0,
              autoFocus: !0,
              name: "email",
              type: "email",
              autoComplete: "email",
              "aria-invalid": actionData?.errors?.email ? !0 : void 0,
              "aria-describedby": "email-error",
              className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
            }
          ),
          actionData?.errors?.email ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "pt-1 text-red-700", id: "email-error", children: actionData.errors.email }) : null
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
          "label",
          {
            htmlFor: "password",
            className: "block text-sm font-medium text-gray-700",
            children: "Password"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "mt-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            "input",
            {
              id: "password",
              ref: passwordRef,
              name: "password",
              type: "password",
              autoComplete: "current-password",
              "aria-invalid": actionData?.errors?.password ? !0 : void 0,
              "aria-describedby": "password-error",
              className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
            }
          ),
          actionData?.errors?.password ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "pt-1 text-red-700", id: "password-error", children: actionData.errors.password }) : null
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("input", { type: "hidden", name: "redirectTo", value: redirectTo }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
        "button",
        {
          type: "submit",
          className: "w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400",
          children: "Log in"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            "input",
            {
              id: "remember",
              name: "remember",
              type: "checkbox",
              className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            "label",
            {
              htmlFor: "remember",
              className: "ml-2 block text-sm text-gray-900",
              children: "Remember me"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "text-center text-sm text-gray-500", children: [
          "Don't have an account?",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
            import_react12.Link,
            {
              className: "text-blue-500 underline",
              to: {
                pathname: "/join",
                search: searchParams.toString()
              },
              children: "Sign up"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}

// app/routes/home.tsx
var home_exports = {};
__export(home_exports, {
  default: () => HomePageRoute,
  loader: () => loader9
});
var import_react15 = require("@remix-run/react");

// app/components/Sidebar.tsx
var import_react14 = require("@remix-run/react"), import_jsx_runtime18 = require("react/jsx-runtime");
function Sidebar({
  className,
  servers,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ScrollArea, { className: "h-full w-full rounded-l-md border ", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "p-4 flex flex-col justify-center items-center gap-3", children: [
    children,
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      import_react14.Link,
      {
        className: "flex justify-center items-center text-xl",
        to: "/home/createserver",
        children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Avatar, { className: "h-14 w-14", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(AvatarFallback, { children: "CR+" }) })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Separator, { className: "my-2" }),
    servers.map((server) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_jsx_runtime18.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_react14.Link, { className: "", to: `/home/${server.id}`, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Avatar, { className: "w-14 h-14", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(AvatarFallback, { asChild: !0, children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-xl", children: server.name.slice(0, 2).toUpperCase() }) }) }) }, server.id) }))
  ] }) }) });
}

// app/routes/home.tsx
var import_jsx_runtime19 = require("react/jsx-runtime");
async function loader9(args) {
  let userData = await requireUser(args.request), userServers = await getUserServers(userData?.id);
  return (0, import_react15.json)({ message: "success", servers: userServers });
}
function HomePageRoute() {
  let loaderData = (0, import_react15.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex min-w-full min-h-full justify-center items-center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Sidebar, { className: "w-1/12 h-lvh", servers: loaderData.servers, children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(ModeToggle, {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "w-11/12", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_react15.Outlet, {}) })
  ] });
}

// app/routes/join.tsx
var join_exports = {};
__export(join_exports, {
  action: () => action7,
  default: () => Join,
  loader: () => loader10,
  meta: () => meta3
});
var import_node11 = require("@remix-run/node"), import_react16 = require("@remix-run/react"), import_react17 = require("react");
var import_jsx_runtime20 = require("react/jsx-runtime"), loader10 = async ({ request }) => await getUserId(request) ? (0, import_node11.redirect)("/") : (0, import_node11.json)({}), action7 = async ({ request }) => {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  if (!validateEmail(email))
    return (0, import_node11.json)(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  if (typeof password != "string" || password.length === 0)
    return (0, import_node11.json)(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  if (password.length < 8)
    return (0, import_node11.json)(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  if (await getUserByEmail(email))
    return (0, import_node11.json)(
      {
        errors: {
          email: "A user already exists with this email",
          password: null
        }
      },
      { status: 400 }
    );
  let user = await createUser(email, password);
  return createUserSession({
    redirectTo,
    remember: !1,
    request,
    userId: user.id
  });
}, meta3 = () => [{ title: "Sign Up" }];
function Join() {
  let [searchParams] = (0, import_react16.useSearchParams)(), redirectTo = searchParams.get("redirectTo") ?? void 0, actionData = (0, import_react16.useActionData)(), emailRef = (0, import_react17.useRef)(null), passwordRef = (0, import_react17.useRef)(null);
  return (0, import_react17.useEffect)(() => {
    actionData?.errors?.email ? emailRef.current?.focus() : actionData?.errors?.password && passwordRef.current?.focus();
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "flex min-h-full flex-col justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "mx-auto w-full max-w-md px-8", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_react16.Form, { method: "post", className: "space-y-6", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "label",
        {
          htmlFor: "email",
          className: "block text-sm font-medium text-gray-700",
          children: "Email address"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "mt-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
          "input",
          {
            ref: emailRef,
            id: "email",
            required: !0,
            autoFocus: !0,
            name: "email",
            type: "email",
            autoComplete: "email",
            "aria-invalid": actionData?.errors?.email ? !0 : void 0,
            "aria-describedby": "email-error",
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          }
        ),
        actionData?.errors?.email ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "pt-1 text-red-700", id: "email-error", children: actionData.errors.email }) : null
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "label",
        {
          htmlFor: "password",
          className: "block text-sm font-medium text-gray-700",
          children: "Password"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "mt-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
          "input",
          {
            id: "password",
            ref: passwordRef,
            name: "password",
            type: "password",
            autoComplete: "new-password",
            "aria-invalid": actionData?.errors?.password ? !0 : void 0,
            "aria-describedby": "password-error",
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          }
        ),
        actionData?.errors?.password ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "pt-1 text-red-700", id: "password-error", children: actionData.errors.password }) : null
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("input", { type: "hidden", name: "redirectTo", value: redirectTo }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      "button",
      {
        type: "submit",
        className: "w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400",
        children: "Create Account"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "text-center text-sm text-gray-500", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        import_react16.Link,
        {
          className: "text-blue-500 underline",
          to: {
            pathname: "/login",
            search: searchParams.toString()
          },
          children: "Log in"
        }
      )
    ] }) })
  ] }) }) });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-N6OIQX4D.js", imports: ["/build/_shared/chunk-2DEFOA4O.js", "/build/_shared/chunk-G5WX4PPA.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-DXPZAJ43.js", imports: ["/build/_shared/chunk-L62TT7BY.js", "/build/_shared/chunk-7KHMOEDT.js", "/build/_shared/chunk-N2EGUKL4.js", "/build/_shared/chunk-5TRFQBKG.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-FDKTJZ5V.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/action.set-theme": { id: "routes/action.set-theme", parentId: "root", path: "action/set-theme", index: void 0, caseSensitive: void 0, module: "/build/routes/action.set-theme-JSIJNEPO.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.messages": { id: "routes/api.messages", parentId: "root", path: "api/messages", index: void 0, caseSensitive: void 0, module: "/build/routes/api.messages-AB6N6E7W.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/healthcheck": { id: "routes/healthcheck", parentId: "root", path: "healthcheck", index: void 0, caseSensitive: void 0, module: "/build/routes/healthcheck-TDJYY3P6.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/home": { id: "routes/home", parentId: "root", path: "home", index: void 0, caseSensitive: void 0, module: "/build/routes/home-YZAIHDGL.js", imports: ["/build/_shared/chunk-WZ326R7G.js", "/build/_shared/chunk-4LZS5Y34.js", "/build/_shared/chunk-2TZPZLYA.js", "/build/_shared/chunk-FNS4US6T.js", "/build/_shared/chunk-WWKCJM4B.js", "/build/_shared/chunk-Q4AH4KF6.js", "/build/_shared/chunk-D63ML5IU.js", "/build/_shared/chunk-TE43Z3AH.js", "/build/_shared/chunk-3JLSNJ3V.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/home.$serverId": { id: "routes/home.$serverId", parentId: "routes/home", path: ":serverId", index: void 0, caseSensitive: void 0, module: "/build/routes/home.$serverId-DOK5F2JA.js", imports: ["/build/_shared/chunk-SKOU4VTF.js", "/build/_shared/chunk-7KHMOEDT.js", "/build/_shared/chunk-N2EGUKL4.js", "/build/_shared/chunk-5TRFQBKG.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/home.$serverId.$channelId": { id: "routes/home.$serverId.$channelId", parentId: "routes/home.$serverId", path: ":channelId", index: void 0, caseSensitive: void 0, module: "/build/routes/home.$serverId.$channelId-NCEQQL2E.js", imports: ["/build/_shared/chunk-4LZS5Y34.js", "/build/_shared/chunk-MHQVQBPA.js", "/build/_shared/chunk-2TZPZLYA.js", "/build/_shared/chunk-Q4AH4KF6.js", "/build/_shared/chunk-D63ML5IU.js", "/build/_shared/chunk-3JLSNJ3V.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/home.$serverId.createChannel": { id: "routes/home.$serverId.createChannel", parentId: "routes/home.$serverId", path: "createChannel", index: void 0, caseSensitive: void 0, module: "/build/routes/home.$serverId.createChannel-A5T6IY3H.js", imports: ["/build/_shared/chunk-YHJ4IDJC.js", "/build/_shared/chunk-MHQVQBPA.js", "/build/_shared/chunk-2TZPZLYA.js", "/build/_shared/chunk-3JLSNJ3V.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/home.createserver": { id: "routes/home.createserver", parentId: "routes/home", path: "createserver", index: void 0, caseSensitive: void 0, module: "/build/routes/home.createserver-G2BKTCFZ.js", imports: ["/build/_shared/chunk-YHJ4IDJC.js", "/build/_shared/chunk-MHQVQBPA.js", "/build/_shared/chunk-7KHMOEDT.js", "/build/_shared/chunk-N2EGUKL4.js", "/build/_shared/chunk-5TRFQBKG.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/join": { id: "routes/join", parentId: "root", path: "join", index: void 0, caseSensitive: void 0, module: "/build/routes/join-HTEVAFT2.js", imports: ["/build/_shared/chunk-B7RZPZQJ.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-SOS36SKX.js", imports: ["/build/_shared/chunk-WZ326R7G.js", "/build/_shared/chunk-B7RZPZQJ.js", "/build/_shared/chunk-2TZPZLYA.js", "/build/_shared/chunk-WWKCJM4B.js", "/build/_shared/chunk-D63ML5IU.js", "/build/_shared/chunk-3JLSNJ3V.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-MWX2H6AO.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "a3ac2614", hmr: void 0, url: "/build/manifest-A3AC2614.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public\\build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/home.$serverId.createChannel": {
    id: "routes/home.$serverId.createChannel",
    parentId: "routes/home.$serverId",
    path: "createChannel",
    index: void 0,
    caseSensitive: void 0,
    module: home_serverId_createChannel_exports
  },
  "routes/home.$serverId.$channelId": {
    id: "routes/home.$serverId.$channelId",
    parentId: "routes/home.$serverId",
    path: ":channelId",
    index: void 0,
    caseSensitive: void 0,
    module: home_serverId_channelId_exports
  },
  "routes/home.createserver": {
    id: "routes/home.createserver",
    parentId: "routes/home",
    path: "createserver",
    index: void 0,
    caseSensitive: void 0,
    module: home_createserver_exports
  },
  "routes/action.set-theme": {
    id: "routes/action.set-theme",
    parentId: "root",
    path: "action/set-theme",
    index: void 0,
    caseSensitive: void 0,
    module: action_set_theme_exports
  },
  "routes/home.$serverId": {
    id: "routes/home.$serverId",
    parentId: "routes/home",
    path: ":serverId",
    index: void 0,
    caseSensitive: void 0,
    module: home_serverId_exports
  },
  "routes/api.messages": {
    id: "routes/api.messages",
    parentId: "root",
    path: "api/messages",
    index: void 0,
    caseSensitive: void 0,
    module: api_messages_exports
  },
  "routes/healthcheck": {
    id: "routes/healthcheck",
    parentId: "root",
    path: "healthcheck",
    index: void 0,
    caseSensitive: void 0,
    module: healthcheck_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: "home",
    index: void 0,
    caseSensitive: void 0,
    module: home_exports
  },
  "routes/join": {
    id: "routes/join",
    parentId: "root",
    path: "join",
    index: void 0,
    caseSensitive: void 0,
    module: join_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
});
