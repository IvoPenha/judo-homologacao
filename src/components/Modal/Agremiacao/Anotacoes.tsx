import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
//import '../../node_modules/react-quill/dist/quill.snow.css';
import "../../../../node_modules/react-quill/dist/quill.snow.css"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik, useFormikContext } from "formik";
import * as Yup from "yup";
import { useDebounce } from "../../../utils/useDebounce";

import { Modal } from "../index";
import { Container, Stack, Button, TextField, DialogActions } from "@mui/material";
import { 
  ClearOutlined as ClearIcon,
  CheckOutlined as CheckIcon 
} from '@mui/icons-material';

import { useAlertContext } from "../../../hooks/useAlertProvider";

import { useModal } from "../../../hooks/useModalProvider";
import { useFormikProvider } from "../../../hooks/useFormikProvider";
import { agremiacaoRoutes } from "../../../providers/services/api/agremiacao";


interface ModalAnotacoesAgremiacaoProps {
  agremiacaoId: number;
  currentNotes?: any;
  isRegister?: boolean;
};

export function ModalAnotacoesAgremiacao({ agremiacaoId, currentNotes, isRegister = false }: ModalAnotacoesAgremiacaoProps) {
  const queryClient = useQueryClient();
  const { handleClose } = useModal();
  const { emitAlertMessage } = useAlertContext();
  const { setNotes } = useFormikProvider();

  const formik = useFormik({
    initialValues: {
      anotacoes: '',
    },
    validationSchema: Yup.object().shape({
      anotacoes: Yup.string().trim().required('Campo obrigatório'),
    }),
    onSubmit: (values) => {
      if (isRegister) {
        console.log('is register', isRegister)
        setNotes(values.anotacoes);
        console.log('values', values)
        return handleClose();
      }
      mutate();

    },
  });

  useEffect(() => {
    formik.setFieldValue('anotacoes', currentNotes)
  }, [currentNotes])

  const { isLoading, mutate } = useMutation(
    () => agremiacaoRoutes.anotacoesAgremiacao(agremiacaoId, formik.values),
    {
      onSuccess: () => {
        //@ts-ignore
        queryClient.invalidateQueries('agremiacao-list');
        handleClose();
      },
      onError: () => {
        emitAlertMessage("error", "Erro ao salvar as anotações");
        // handleClose();
      }
    }
  )

  const [content, setContent] = useState('');

  function handleChange(value:string) {
    setContent(value);
  }

  function handleSubmit() {
    console.log(content)
  }

  return (
    <Modal title="Anotações" width="lg" modalId={2}>
      <form onSubmit={handleSubmit}>
        <Container maxWidth={false}>
          <Stack
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ p: 3 }}
          >
            
            <ReactQuill
              theme="snow"
              id="anotacoes"
              className="anotacoesTextfield"
              value={content}
              onChange={handleChange}
              //onBlur={formik.handleBlur}
              style={{
                width: '100%'
              }}
            />
            
            {/*
            <TextField
              label="Anotações"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              type='text'
              name='anotacoes'
              id='anotacoes'
              value={formik.values['anotacoes']}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched['anotacoes'] && Boolean(formik.errors['anotacoes'])}
              helperText={formik.touched['anotacoes'] && formik.errors['anotacoes']}
            />
            */}
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                gap: 4,
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
                startIcon={<CheckIcon />}
                size="medium"
                sx={{ minWidth: "120px", textTransform: "none" }}
              >
                {
                  isLoading ? 'Salvando...' : 'Ok'
                }
              </Button>
              <Button
                variant="contained"
                color="error"
                type="button"
                onClick={handleClose}
                startIcon={<ClearIcon />}
                size="medium"
                sx={{ minWidth: "120px", textTransform: "none" }}
              >
                Cancelar
              </Button>
            </DialogActions>
          </Stack>
        </Container>
      </form>
    </Modal>
  );
}