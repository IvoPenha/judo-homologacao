import {
  Alert,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Close as CloseIcon } from '@mui/icons-material';

import { useAlertContext } from "../../hooks/useAlertProvider";

export function AlertComponent() {
  const { open, alertStatus, alertMessage, handleAlertClose } = useAlertContext();

  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      sx={{
        paddingTop: 10,
        borderRadius: 4,
      }}
      autoHideDuration={3000}
      onClose={handleAlertClose}
    >
      <Alert
        severity={alertStatus}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleAlertClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mt: 10 }}
      >
        { alertMessage }
      </Alert>
    </Snackbar>
  );
}
