import { createContext, useState } from "react";

import type { ReactNode } from "react";
import type { AlertColor } from "@mui/material";

interface AlertComponentProps {
  open: boolean;
  emitAlertMessage: (status: AlertColor, message: string) => void;
  alertStatus: AlertColor;
  alertMessage: string;
  handleAlertClose: () => void;
}

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertContext = createContext({} as AlertComponentProps);

export function AlertProvider({ children }: AlertProviderProps) {
  const [alertStatus, setAlertStatus] = useState<AlertColor>("warning");
  const [open, setOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handleAlertClose = () => {
    setOpen(false);
  };

  const handleAlertOpen = () => {
    setOpen(true);
  };

  const emitAlertMessage = (status: AlertColor, message: string) => {
    setAlertStatus(status);
    setAlertMessage(message);
    handleAlertOpen();
  };

  return (
    <AlertContext.Provider
      value={{
        open,
        emitAlertMessage,
        alertStatus,
        alertMessage,
        handleAlertClose,
      }}
    >
      { children }
    </AlertContext.Provider>
  );
}