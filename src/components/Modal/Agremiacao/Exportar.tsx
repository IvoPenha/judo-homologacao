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
       },
      onError: () => {
        emitAlertMessage("error", "Erro ao exportar agremiações");
      },
    }
  );

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [isDischeckAll, setIsDischeckAll] = useState(false);

  const [isAllCheckboxChecked, setIsAllCheckboxChecked] = useState(false);
  function handleCheckAll() {
    if (isIndeterminate == true || isCheckAll == true){
      setIsDischeckAll(true)
      setIsCheckAll(false)
      setIsIndeterminate(false)
    } else{
      setIsDischeckAll(false)
      setIsCheckAll(true);
      setIsIndeterminate(false);
    }
  }
  function handleInderteminate(bool : boolean) {
    setIsDischeckAll(false)
    setIsCheckAll(false);
    setIsIndeterminate(true);
    return bool;
  }
  function resetCheckbox() {
    setIsDischeckAll(false)
    setIsCheckAll(false);
    setIsIndeterminate(false);
  }
  const {openModalId } = useModal()
  useEffect(() => {
    setIsDischeckAll(true)
  }, [openModalId]);

  return (
    <Modal title="Exportar para planilha" modalId={4} width="sm">
      <form onSubmit={formik.handleSubmit}>
        <Container maxWidth={false} sx={{}}>
          <Grid
            container
            rowSpacing={.5}
            columnSpacing={2}
            gridAutoColumns={"1fr"}
            sx={{ pl: 2, pt: 2, mb:'4rem'}}

            
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
              label={"Selecionar tudo"}
            />

            {AgremiacaoExportValues.map((item, index) => (
              <Grid item xs={12} maxHeight={45}>
                <FormControlLabel
                  control={
                    <Checkbox
                      //@ts-ignore
                      checked={
                        isCheckAll
                        //@ts-ignore
                          ? (formik.values[item.value] = true) : 
                        //@ts-ignore
                          isDischeckAll ? formik.values[item.value] = false : formik.values[item.value]
                      }
                      onChange={
                        isCheckAll
                          ? () => {
                            handleInderteminate(false);
                        //@ts-ignore
                              formik.values[item.value] = false;
                            }
                          : 
                          isDischeckAll
                            ? () => {
                              handleInderteminate(true);
                          //@ts-ignore
                                formik.values[item.value] = true;
                              } : (formik.handleChange as any)
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
                position:'absolute',
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "100%",
                background: '#fff',
                height: '4rem',
                gap: 2,
                bottom:0,
                right: 18,
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
