import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
//import '../../node_modules/react-quill/dist/quill.snow.css';
import "../../../../node_modules/react-quill/dist/quill.snow.css"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik, useFormikContext } from "formik";
import * as Yup from "yup";
import { useDebounce } from "../../../utils/useDebounce";

import '../../../styles/global.scss'

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
import { useParams } from "react-router";


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

 
  useEffect(() => {
    
  }, [currentNotes])


  const [content, setContent] = useState('');

  function handleChange(value:string) {
    setContent(value);
  }

  
  const { id } = useParams<{ id: string }>();
  
  function handleSubmit() {
    if(id){
      //@ts-ignore
      agremiacaoRoutes.anotacoesAgremiacao(id, 'alo '+content.toString())
    }
    setNotes(content);
    handleClose();
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
              defaultValue={agremiacaoId ? '<p>aa<p/>' : ''}
              onChange={handleChange}
              //onBlur={formik.handleBlur}
              style={{
                width: '100%',
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
                type="button"
                onClick={handleSubmit}
                startIcon={<CheckIcon />}
                size="medium"
                sx={{ minWidth: "120px", textTransform: "none" }}
              >
                  Ok
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