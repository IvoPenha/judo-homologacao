import { useState } from 'react';

import {
  IconButton,
  Input,
  InputLabel,
  Typography,

} from '@mui/material';
import { UploadOutlined as UploadIcon, PictureAsPdfOutlined as PdfIcon } from '@mui/icons-material';

import { useFormikProvider } from '../../hooks/useFormikProvider';
import type { FilesTypes } from '../../providers/context/FormikContext';

interface UploadDocumentComponentProps {
  documentName: keyof FilesTypes;
}

export function UploadDocumentComponent({ documentName }: UploadDocumentComponentProps) {
  const [file, setFile] = useState<File | null>(null);
  const { handleChangeFile, files } = useFormikProvider();

  return (
    <InputLabel
      htmlFor={documentName}
      sx={{
        color: 'black',
        cursor: "pointer",
        backgroundColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <Input
        type='file'
        id={documentName}
        name={documentName}
        inputProps={{ accept: 'application/pdf' }}
        onChange={(e) => {
          const fileReader = new FileReader();
          const input = e.target as HTMLInputElement;
          if (!input.files?.length) return;
          const newFile = input.files[0];
          setFile(newFile);
          handleChangeFile({ [documentName]: newFile });
          fileReader.readAsDataURL(newFile);
        }}
        sx={{ display: 'none' }}
      />
      <Typography variant="body1" sx={{ color: 'black' }}>
        {file ? "Enviado!" : documentName}
      </Typography>
      <IconButton aria-label={`upload ${documentName}`} component="span">
        <UploadIcon />
      </IconButton>
    </InputLabel>
  );
}