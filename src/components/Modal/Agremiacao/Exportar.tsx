import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BlobClient } from "@azure/storage-blob";

import { Modal } from "../index";
import {
  Box,
  Container,
  Grid,
  Checkbox,
  FormControlLabel,
  DialogActions,
} from "@mui/material";

import { useModal } from "../../../hooks/useModalProvider";
import { useAlertContext } from "../../../hooks/useAlertProvider";

import { AgremiacaoOptions } from "../../../models/AgremiacaoModel";
import { values as InitialValues } from "../../Form/Agremiacao/values/exportar";
import { validation as ValidationSchema } from "../../Form/Agremiacao/validation/exportar";

import { agremiacaoRoutes } from "../../../providers/services/api/agremiacao";
import { StyledButton as Button } from "../../../components/Button";
import { CheckBox, UploadFile, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";

function downloadFile(fileUrl: string, fileName: string) {
  
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   
}

export function ModalExportarAgremiacao() {
  const { AgremiacaoExportValues } = AgremiacaoOptions;
  const { exportarAgremiacao } = agremiacaoRoutes;
  const { handleClose } = useModal();
  const { emitAlertMessage } = useAlertContext();

  const formik = useFormik({
    initialValues: InitialValues,
    validationSchema: Yup.object(ValidationSchema),
    onSubmit: (values) => {
      mutate();
    },
  });

  const { isLoading, mutate } = useMutation(
    () => exportarAgremiacao(formik.values),
    {
      onSuccess: () => {
        handleClose();
      },
      onSettled: async (data) => {
        downloadFile(data, `agremiacoes-${new Date().toLocaleDateString()}.xlsx`)
        // const blobClient = new BlobClient(data);
        // await blobClient.downloadToFile(`agremiacoes-${new Date().toLocaleDateString()}.xlsx`);
      },
      onError: () => {
        emitAlertMessage("error", "Erro ao exportar agremiações");
      },
    }
  );

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  const [isAllCheckboxChecked, setIsAllCheckboxChecked] = useState(false);
  function handleCheckAll() {
    setIsCheckAll(true);
    setIsIndeterminate(false);
  }
  function handleDisCheckAll() {
    setIsCheckAll(false);
    setIsIndeterminate(true);
    return false;
  }
  useEffect(() => {
    setIsCheckAll(false);
    setIsAllCheckboxChecked(false);
  }, [handleClose]);

  return (
    <Modal title="Exportar para planilha" modalId={4} width="sm">
      <form onSubmit={formik.handleSubmit}>
        <Container maxWidth={false} sx={{}}>
          <Grid
            container
            spacing={2}
            gridAutoColumns={"1fr"}
            sx={{ pl: 2, pt: 2 }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  //@ts-ignore
                  checked={isCheckAll}
                  onChange={handleCheckAll}
                  indeterminate={isIndeterminate}
                  name={"checkAll"}
                  id={"checkAll"}
                />
              }
              label={"Exportar tudo"}
            />

            {AgremiacaoExportValues.map((item, index) => (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      //@ts-ignore
                      checked={
                        isCheckAll
                          ? true
                          //@ts-ignore
                          : formik.values[item.value] 
                      }
                      onChange={
                        isCheckAll
                          ? () => {
                              handleDisCheckAll();
                              false;
                            }
                          : (formik.handleChange as any)
                      }
                      name={item.value}
                      id={item.value}
                    />
                  }
                  label={`${item.label}`}
                  key={index}
                />
              </Grid>
            ))}
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "100%",
                gap: 4,
                mt: 2,
              }}
            >
              <Button type="submit" disabled={isLoading}>
                <UploadFile />
                {isLoading ? "Exportando..." : "Exportar"}
              </Button>
              <Button color="error" type="button" onClick={handleClose}>
                <Close />
                Cancelar
              </Button>
            </DialogActions>
          </Grid>
        </Container>
      </form>
    </Modal>
  );
}
