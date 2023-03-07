import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "./index";
import { FormFilterAgremiacao } from "../Form/Agremiacao/FilterAgremiacao";

import type { IAgremiacao, IFiltersAgremicao } from "../../models/AgremiacaoModel";

import  '../../styles/global.scss'
import { useFormikProvider } from "../../hooks/useFormikProvider";
import { useModal } from "../../hooks/useModalProvider";

import { agremiacaoRoutes } from "../../providers/services/api/agremiacao";

import {
  Container,
  DialogActions,
  Button,
} from '@mui/material';

export function ModalFilterAgremiacao() {
  const [campo, setCampo] = useState('');
  const [valor, setValor] = useState('');

  const [currentFilterIndex, setCurrentFilterIndex] = useState<number>(0);
  const [filters, setFilters] = useState<IFiltersAgremicao[]>([{
    column: '',
    operator: '',
    initialParentheses: '',
    finalParentheses: '',
    firstValue: '',
    secondValue: '',
    logicOperator: '',
  }]);

  const { filtersAgremiacao, filtersToPost, handleFilterChange, setValuesFiltered, setFiltersToPost,  } = useFormikProvider();
  const { handleClose, openModalId } = useModal();

  const { postAgremiacaoFilter } = agremiacaoRoutes;
  const queryClient = useQueryClient();
  
//   const { isLoading, mutate, data } = useMutation(
//     async () => {
      
//       await handleFilterChange(filtersAgremiacao);
//       return postAgremiacaoFilter(filtersToPost) 
//     },
//     {
//       onSuccess: async () => {
//         console.log('onsuccess')
//         console.log(filtersToPost);
//         handleFilterChange(filtersAgremiacao)
//         const intermediaryFilters : {itens: IAgremiacao[] } = await postAgremiacaoFilter(filtersToPost )
//         // reset value
//         console.log('here',intermediaryFilters.itens)
//         setValuesFiltered(intermediaryFilters.itens)
        
//         //@ts-ignore
//         queryClient.invalidateQueries('agremiacao-list');
//         handleClose();
//       },
//       onSettled(data) {      
// //@ts-ignore
//         setValuesFiltered(data?.itens)
//       },
//       onError: () => {
//         // emitAlertMessage("error", "Erro ao salvar as anotações");
//         // handleClose();
//       }
//     }
//   )

const [isLoading, setIsLoading] = useState(false)

async function handleSubmit(){
  await handleFilterChange(filtersAgremiacao)
  setTimeout(handleClose(),300)
}
  return (
    <Modal
      title="Filtro"
      width="xl"
      modalId={1}
      
    >
      <Container maxWidth={false} sx={{ p: 5 }}>
        <FormFilterAgremiacao />
        {
          filtersAgremiacao?.map((filters, index) => { 
            return <FormFilterAgremiacao key={index} indexValues={index} values={filters} />
          })
        }
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            disabled={ filtersAgremiacao.length == 0 ||isLoading}
            sx={{ minWidth: "6vw", textTransform: "none" }}
            onClick={() => handleSubmit()}
          >
            {isLoading ? 'Filtrando...' : 'Filtrar'}
          </Button>
          <Button
            variant="contained"
            color="error"
            type="button"
            onClick={handleClose}
            size="large"
            sx={{ minWidth: "6vw", textTransform: "none" }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Container>
    </Modal>
  );
}