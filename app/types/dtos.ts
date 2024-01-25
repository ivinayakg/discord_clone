import { Message } from "@prisma/client";

export type MessageResponse = Message & {
  author: {
    email: string;
    id: string;
  };
};
