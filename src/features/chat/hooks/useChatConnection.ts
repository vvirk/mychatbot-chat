import { useEffect } from "react";
import { fakeSocket } from "../../../services/fakeSocket";
import { useAppDispatch } from "../../../app/hooks";
import { connectionStatusChanged } from "../chatSlice";

export function useChatConnection() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = fakeSocket.subscribeToStatusChanges((status) => {
      dispatch(connectionStatusChanged(status));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);
}