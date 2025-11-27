import { useEffect } from "react";
import { fakeSocket } from "../../../services/fakeSocket";
import { useAppDispatch } from "../../../app/hooks";
import {
  messageAcked,
  messageErrored,
  incomingMessageReceived,
} from "../chatSlice";

export function useChatServerEvents() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = fakeSocket.subscribeToServerEvents((event) => {
      switch (event.type) {
        case "ack":
          dispatch(
            messageAcked({
              clientId: event.clientId,
              serverId: event.serverId,
            })
          );
          break;

        case "error":
          dispatch(
            messageErrored({
              clientId: event.clientId,
              reason: event.reason,
            })
          );
          break;

        case "incoming":
          dispatch(
            incomingMessageReceived({
              serverId: event.serverId,
              content: event.content,
              createdAt: event.createdAt,
            })
          );
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);
}