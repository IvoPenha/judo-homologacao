import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../index";
import { FormFilterAgremiacao } from "../../Form/Agremiacao/FilterAgremiacao";

import type {
  IAgremiacao,
  IFiltersAgremicao,
} from "../../../models/AgremiacaoModel";

import "../../../styles/global.scss";
import { useFormikProvider } from "../../../hooks/useFormikProvider";
import { useModal } from "../../../hooks/useModalProvider";

import { agremiacaoRoutes } from "../../../providers/services/api/agremiacao";

import { Container, DialogActions } from "@mui/material";
import { Close, FilterAlt } from "@mui/icons-material";
import { StyledButton as Button } from "../../Button";

export function ModalFilterAgremiacao() {
  const {
    filtersAgremiacao,
    filtersToPost,
    handleFilterChange,
    setValuesFiltered,
    setFiltersToPost,
  } = useFormikProvider();
  const { handleClose, openModalId } = useModal();

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setFiltersToPost([]);
    await handleFilterChange(
      filtersAgremiacao.filter(
        (value, index, self) => self.indexOf(value) === index
      )
    );

    setTimeout(() => handleClose(), 300);
  }
  return (
    <Modal title="Filtro" width="xl" modalId={1}>
      <Container maxWidth={false} sx={{ p: 5 }}>
        <FormFilterAgremiacao />
        {filtersAgremiacao?.map((filters, index) => {
          return (
            <FormFilterAgremiacao
              key={index}
              indexValues={index}
              values={filters}
            />
          );
        })}
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
            disabled={filtersAgremiacao.length == 0 || isLoading}
            sx={{ minWidth: "6vw", textTransform: "none" }}
            onClick={() => handleSubmit()}
          >
          <FilterAlt/>  {isLoading ? "Filtrando..." : "Aplicar"} 
          </Button>
          <Button
            variant="contained"
            color="error"
            type="button"
            onClick={handleClose}
            size="large"
            sx={{ minWidth: "6vw", textTransform: "none" }}
          >
          <Close/>  Cancelar
          </Button>
        </DialogActions>
      </Container>
    </Modal>
  );
}
