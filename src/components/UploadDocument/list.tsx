import { Grid, IconButton, Typography } from "@mui/material";
import { PictureAsPdfOutlined as PdfIcon } from "@mui/icons-material";

import { useFormikProvider } from "../../hooks/useFormikProvider";

export function ListDocumentsUploaded() {
  const { files } = useFormikProvider();

  return (
    <Grid container spacing={2}>
      {Object.values(files).length > 0 ? Object.values(files).map((file) => (
        <Grid item key={file.name} lg={12} xs={12}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <IconButton aria-label={file.name} component="span">
            <PdfIcon />
          </IconButton>
          <Typography variant="body1" sx={{ color: 'black' }}>{file.name}</Typography>
        </Grid>
      )) : null}
    </Grid>
  );
}