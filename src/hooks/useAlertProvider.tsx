import { useContext } from 'react';
import { AlertContext } from '../providers/context/AlertContext';

export function useAlertContext() {
  const context = useContext(AlertContext);

  const {
    open,
    emitAlertMessage,
    alertStatus,
    alertMessage,
    handleAlertClose,
  } = context;

  return {
    open,
    emitAlertMessage,
    alertStatus,
    alertMessage,
    handleAlertClose,
  };
};