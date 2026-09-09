import {
  adminApiClient,
} from "@/shared/api/admin-api-client";

import type {
  ContactMessage,
  ContactMessageListResponse,
  ContactMessageStatusUpdate,
  MessageStatus,
} from "../types/message.types";


const BASE_PATH =
  "/contact-messages";


export async function getMessages(
  statusFilter?: MessageStatus,
) {
  const params =
    new URLSearchParams();

  if (statusFilter) {
    params.set(
      "status_filter",
      statusFilter,
    );
  }

  const query =
    params.toString();

  const path =
    query
      ? `${BASE_PATH}?${query}`
      : BASE_PATH;

  return adminApiClient<
    ContactMessageListResponse
  >(path);
}


export async function getMessage(
  messageId: number,
) {
  return adminApiClient<
    ContactMessage
  >(
    `${BASE_PATH}/${messageId}`,
  );
}


export async function updateMessageStatus(
  messageId: number,
  status: MessageStatus,
) {
  const payload:
    ContactMessageStatusUpdate = {
      status,
    };

  return adminApiClient<
    ContactMessage
  >(
    `${BASE_PATH}/${messageId}/status`,
    {
      method: "PATCH",

      body: JSON.stringify(
        payload,
      ),
    },
  );
}


export async function deleteMessage(
  messageId: number,
) {
  await adminApiClient<void>(
    `${BASE_PATH}/${messageId}`,
    {
      method: "DELETE",
    },
  );
}