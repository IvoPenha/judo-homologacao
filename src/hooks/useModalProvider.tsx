import { useContext } from 'react';
import { ModalContext } from '../providers/context/ModalContext';

export function useModal() {
  const context = useContext(ModalContext);
  const { openModalId, handleClose, handleClickOpen } = context;


  
  return {
    openModalId, handleClose, handleClickOpen
  }
}