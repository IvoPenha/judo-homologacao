import { ReactNode } from "react";
import { Dialog, Typography, IconButton, DialogTitle, DialogContent } from "@mui/material";
import { Close } from "@mui/icons-material";

import { useModal } from "../../hooks/useModalProvider";

interface ModalProps {
  title?: string;
  children: ReactNode;
  width?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  modalId: number;
}

export function Modal({ title, children, width, modalId }: ModalProps) {
  const { openModalId, handleClose } = useModal();

  return (
    <Dialog
      open={openModalId === modalId}
      {...() => console.log(openModalId,modalId)}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth={width}
      PaperProps={{
        style: {
          borderRadius: "10px",
        }
      }}
      sx={{
        "& .MuiDialogContent-root": {
          p: 0,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, mb: 1, ml: 1, p: 2 }}>
        {title && (
          <Typography
            color="#4887C8"
            fontWeight='normal'
            fontSize="1.3rem"
          >
            {title}
          </Typography>
        )}
        <IconButton
          type="button"
          sx={{ position: "absolute", top: 8, right: 8 }}
          aria-label="close"
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
}