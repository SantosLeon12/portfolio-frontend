import {
  useQuery,
} from "@tanstack/react-query";

import {
  getMessage,
  getMessages,
} from "../api/messages.api";

import type {
  MessageStatus,
} from "../types/message.types";


export const messagesQueryKey =
  ["messages"] as const;


export const messageQueryKeys = {
  all: messagesQueryKey,

  list: (
    status?: MessageStatus,
  ) =>
    [
      ...messagesQueryKey,
      "list",
      status ?? "ALL",
    ] as const,

  detail: (
    messageId: number,
  ) =>
    [
      ...messagesQueryKey,
      "detail",
      messageId,
    ] as const,
};


export function useMessages(
  status?: MessageStatus,
) {
  return useQuery({
    queryKey:
      messageQueryKeys.list(
        status,
      ),

    queryFn: () =>
      getMessages(status),
  });
}


export function useMessage(
  messageId: number | null,
  enabled = true,
) {
  return useQuery({
    queryKey:
      messageQueryKeys.detail(
        messageId ?? 0,
      ),

    queryFn: () =>
      getMessage(
        messageId as number,
      ),

    enabled:
      enabled &&
      messageId !== null,
  });
}