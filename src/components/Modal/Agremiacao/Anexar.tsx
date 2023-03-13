import { useParams } from "react-router-dom";
import { Modal } from "../index";
import Dropzone, { DropzoneRootProps, useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Container,
  Grid,
  InputLabel,
  Input,
  IconButton,
  Typography,
  DialogActions,
  Box,
} from "@mui/material";
import {
  PictureAsPdfOutlined as PdfIcon,
  CloudUpload as CloudUploadIcon,
  UploadFile,
  FileUploadOutlined,
  FileUploadRounded,
  FilePresent,
  Close,
  CountertopsOutlined,
} from "@mui/icons-material";
import { StyledButton as Button } from "../../Button";
import { UploadDocumentComponent } from "../../UploadDocument";
import { ListDocumentsUploaded } from "../../UploadDocument/list";

import { useFormikProvider } from "../../../hooks/useFormikProvider";

import { agremiacaoRoutes } from "../../../providers/services/api/agremiacao";
import { useAlertContext } from "../../../hooks/useAlertProvider";
import { useModal } from "../../../hooks/useModalProvider";
import { useState, useCallback, useEffect } from "react";

export function ModalAnexosAgremiacao() {
  const formik = useFormik({
    initialValues: {
      files: [],
    },
    onSubmit: (values) => {
      // try {
      //   const response = await anexarArquivoAgremiacao(id, values)
      // } catch (error) {
      //   console.log('error', error)
      // }
    },
  });

  const filesUploadedList = formik.values.files?.map((file: File) => (
    <Grid
      item
      key={file.name}
      lg={12}
      xs={12}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <IconButton aria-label={file.name} component="span">
        <PdfIcon />
      </IconButton>
      <Typography variant="body1" sx={{ color: "black" }}>
        {file.name}
      </Typography>
    </Grid>
  ));

  const { id } = useParams<{ id: string }>();
  const { currentFileToCreate, setCurrentFileToCreate } = useFormikProvider();
  const queryClient = useQueryClient();
  const { handleClose } = useModal();
  const { emitAlertMessage } = useAlertContext();
  const { anexarArquivoAgremiacao } = agremiacaoRoutes;

  async function handleSubmit() {
    setCurrentFileToCreate(files);
    handleClose();
  }
  useEffect(() => {
    if (id) {
      //@ts-ignore
      anexarArquivoAgremiacao(id, currentFileToCreate);
    }
  }, [currentFileToCreate]);

  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  return (
    <Modal title="Anexos" modalId={3} width="md">
      <form>
        <Container maxWidth={false} sx={{ flexGrow: 1, p: 5 }}>
          <Grid
            container
            spacing={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Dropzone onDrop={onDrop}>
              {({ getRootProps, getInputProps, isDragActive, isFocused }) => (
                <div
                  {...getRootProps<DropzoneRootProps>()}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                    cursor: "pointer",
                    width: "100%",
                    gap: 10,
                    backgroundColor:
                      isDragActive || isFocused ? "#eaf6ff" : "inherit",
                    border:
                      isDragActive || isFocused
                        ? "1px dashed #2196f3"
                        : "1px dashed black",
                    borderRadius: "5px",
                  }}
                >
                  <input {...getInputProps()} />
                  <UploadFile
                    style={{
                      display: "block",
                      color: isDragActive || isFocused ? "#0a83df" : "#2d6c9c",
                    }}
                    fontSize="large"
                  />
                  <p style={{ margin: "0", fontSize: "16px", color: "#888" }}>
                    Arraste um arquivo para aqui, ou clique e selecione
                  </p>
                </div>
              )}
            </Dropzone>
            {files.map((file) => (
              <p
                key={file.name}
                style={{
                  color: "#3f6787",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  zIndex: 1000,
                }}
              >
                <FilePresent /> {file.name}{" "}
                <Close
                  color="warning"
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    setFiles(files.filter((item) => item.name !== file.name))
                  }
                />
              </p>
            ))}
            <DialogActions sx={{ display: "flex", gap: 2 }}>
              <Button onClick={handleSubmit}><CloudUploadIcon/> {"Enviar"}</Button>
              <Button
                color="error"
                type="button"
                onClick={() => {
                  formik.setFieldValue("files", []);
                  return handleClose();
                }}
              >
                <Close/>
                Cancelar
              </Button>
            </DialogActions>
          </Grid>
        </Container>
      </form>
    </Modal>
  );
}
