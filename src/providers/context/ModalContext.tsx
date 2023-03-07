import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuthContext } from '../../hooks/useAuthProvider';

type ModalId = number | null;

interface ModalContextData {
  openModalId: ModalId;
  handleClickOpen: (modalId: ModalId) => void;
  handleClose: () => void;
};

interface ModalProviderProps {
  children: ReactNode;
};




export const ModalContext = createContext({} as ModalContextData);

export function ModalProvider({ children }: ModalProviderProps) {
  const [openModalId, setOpenModalId] = useState<ModalId>(null);
  const { verifyToken } = useAuthContext()

  useEffect(()=>{
    verifyToken()
  },[openModalId])

  const handleClickOpen = (modalId: ModalId) => {
    setOpenModalId(modalId);
  };

  const handleClose = () => {
    setOpenModalId(null);
  };

  return (
    <ModalContext.Provider
      value={{
        openModalId,
        handleClickOpen,
        handleClose,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}