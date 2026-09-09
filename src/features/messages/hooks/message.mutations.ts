import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteMessage,
  updateMessageStatus,
} from "../api/messages.api";

import type {
  MessageStatus,
} from "../types/message.types";

import {
  messageQueryKeys,
} from "./message.queries";


type UpdateStatusVariables = {
  messageId: number;
  status: MessageStatus;
};


export function useMessageMutations() {
  const queryClient =
    useQueryClient();


  const updateStatusMutation =
    useMutation({
      mutationFn: ({
        messageId,
        status,
      }: UpdateStatusVariables) =>
        updateMessageStatus(
          messageId,
          status,
        ),

      onSuccess: (
        message,
      ) => {
        queryClient.setQueryData(
          messageQueryKeys.detail(
            message.id,
          ),
          message,
        );

        void queryClient
          .invalidateQueries({
            queryKey:
              messageQueryKeys.all,
          });
      },
    });


  const deleteMutation =
    useMutation({
      mutationFn: (
        messageId: number,
      ) =>
        deleteMessage(
          messageId,
        ),

      onSuccess: (
        _data,
        messageId,
      ) => {
        queryClient.removeQueries({
          queryKey:
            messageQueryKeys.detail(
              messageId,
            ),
        });

        void queryClient
          .invalidateQueries({
            queryKey:
              messageQueryKeys.all,
          });
      },
    });


  return {
    updateStatusMutation,
    deleteMutation,
  };
}