import { useState, useMemo, SyntheticEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Grid } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarQuickFilter,
  GridToolbar,
  GridValueGetterParams,
  useGridApiRef,
} from "@mui/x-data-grid";
import { CreateOutlined as EditIcon } from "@mui/icons-material";

import {
  Search,
  FilterAltOffOutlined as FilterIcon,
} from "@mui/icons-material";

import { ModalFilterAgremiacao } from "../components/Modal/modalFilterAgremiacao";
import { ModalAnotacoesAgremiacao } from "../components/Modal/Agremiacao/Anotacoes";
import { ModalExportarAgremiacao } from "../components/Modal/Agremiacao/Exportar";
import { BackdropComponent } from "../components/Backdrop";
import { useModal } from "../hooks/useModalProvider";
import { useFormikProvider } from "../hooks/useFormikProvider";

import { CadastroAgremiacao } from "./CadastroAgremiacao";
import { Home } from "./Home";
import { StyledButton as Button } from "../components/Button";

import api from "../providers/services/api";
import { agremiacaoRoutes } from "../providers/services/api/agremiacao";
import { TabsAgremiacao } from "./Agremiacao/Tabs";

export function Listagem() {
  document.title = "Listagem de Agremiação";
  const navigate = useNavigate();
  const { handleClickOpen } = useModal();
  const { valuesFiltered, setValuesFiltered } = useFormikProvider();
  const { data, isError, isLoading } = useQuery(
    ["agremiacao-list"],
    agremiacaoRoutes.getAgremiacoes
  );

  const [valueTab, setValueTab] = useState(0);

  const [agremiacaoId, setAgremiacaoId] = useState(0);

  const handleChange = (e: SyntheticEvent, newValue: number) => {
    setAgremiacaoId(0);
    setValueTab(newValue);
  };

  const TabPanel = (props: any) => {
    const { children, value, index, ...other } = props;

    return value === index ? <Box>{children}</Box> : null;
  };

  function QuickSearchToolbar() {
    return (
      <Box
        sx={{
          p: 0.5,
          pr: 2,
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {valuesFiltered.length > 0 ? (
          <div
            style={{
              color: "#4887C8",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginRight: 12,
              cursor: "pointer",
            }}
            onClick={() => {
              setValuesFiltered([]);
              //Limpar o filtro no backend
            }}
          >
            <h5>Limpar Filtros</h5>
            <FilterIcon />
          </div>
        ) : (
          ""
        )}
        <GridToolbarQuickFilter
          variant="outlined"
          size="small"
          placeholder="Pesquisar"
          InputProps={{ endAdornment: <Search /> }}
        />
      </Box>
    );
  }
  function handleDateFormat(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate() + 1;

    const month = date.getMonth() + 1;

    const year = date.getFullYear();
    return `${day > 10 ? day : "0" + day}/${
      month > 10 ? month : "0" + month
    }/${year}`;
  }

  const columns: GridColDef[] = [
    {
      field: "edit-action",
      headerName: "Editar",
      width: 80,
      //@ts-ignore
      renderCell: (params: GridValueGetterParams) => (
        <Button
          onClick={async (e: any) => {
            e.stopPropagation();
            //@ts-ignore
            setAgremiacaoId(params.id);
            setValueTab(1);
            navigate(`editar/${params.id}`, { replace: true });
          }}
        >
          <EditIcon />
        </Button>
      ),
    },
    { field: "sigla", headerName: "Sigla", width: 90 },
    { field: "nome", headerName: "Nome", width: 300 },
    { field: "fantasia", headerName: "Fantasia", width: 150 },
    { field: "responsavel", headerName: "Responsável", width: 150 },
    { field: "representante", headerName: "Representante", width: 200 },
    {
      field: "dataFiliacao",
      headerName: "Data de Filiacao",
      width: 150,
      valueFormatter: (item) =>
        item.value ? handleDateFormat(item?.value) : "",
    },
    {
      field: "dataNascimento",
      headerName: "Data de Nascimento",
      width: 150,
      valueFormatter: (item) =>
        item.value ? handleDateFormat(item?.value) : "",
    },
    { field: "cep", headerName: "CEP", width: 90 },
    { field: "endereco", headerName: "Endereço", width: 300 },
    { field: "bairro", headerName: "Bairro", width: 150 },
    { field: "complemento", headerName: "Complemento", width: 150 },

    {
      field: `${valuesFiltered.length == 0 ? "cidade" : "cidadeNome"}`,
      headerName: "Cidade",
      width: 90,
      valueGetter: ({ value }) =>
        valuesFiltered.length == 0 ? value?.descricao : value,
    },
    {
      field: `${valuesFiltered.length == 0 ? "estado" : "estadoNome"}`,
      headerName: "Estado",
      width: 90,
      valueGetter: ({ value }) =>
        valuesFiltered.length == 0 ? value?.descricao : value,
    },
    {
      field: `${valuesFiltered.length == 0 ? "pais" : "paisNome"}`,
      headerName: "Pais",
      width: 90,
      valueGetter: ({ value }) =>
        valuesFiltered.length == 0 ? value?.descricao : value,
    },
    { field: "telefone", headerName: "Telefone", width: 150 },
    { field: "email", headerName: "Email", width: 300 },
    { field: "cnpj", headerName: "CNPJ", width: 150 },
    {
      field: "inscricaoMunicipal",
      headerName: "Inscrição Municipal",
      width: 150,
    },
    {
      field: "inscricaoEstadual",
      headerName: "Inscrição Estadual",
      width: 150,
    },
    {
      field: "dataCnpj",
      headerName: "Data CNPJ",
      width: 150,
      valueFormatter: (item) =>
        item.value ? handleDateFormat(item?.value) : "",
    },
    {
      field: "dataAta",
      headerName: "Data Ata",
      width: 150,
      valueFormatter: (item) =>
        item.value ? handleDateFormat(item?.value) : "",
    },
    // { field: 'alvaraLocacao', headerName: 'Alvará Locação', width: 150 },
    // { field: 'estatuto', headerName: 'Estatuto', width: 150 },
    // { field: 'contratoSocial', headerName: 'Contrato Social', width: 150 },
    // { field: 'documentacaoAtualizada', headerName: 'Documentação Atualizada', width: 200 },
    {
      field: `${valuesFiltered.length == 0 ? "regiao" : "regiaoNome"}`,
      headerName: "Região",
      width: 90,
      valueGetter: ({ value }) =>
        valuesFiltered.length == 0 ? value?.descricao : value,
    },
    { field: "anotacoes", headerName: "Anotações", width: 500 },
  ];
  const [listaAgremiacao, setListaAgremiacao] = useState([{}]);
  useEffect(() => {
    console.log("lista", listaAgremiacao);
  }, [listaAgremiacao]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        height: "80vh",
        marginTop: 5,
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <TabsAgremiacao />
          <Grid item xs={12}>
            <TabPanel value={valueTab} index={2}>
              <Home />
            </TabPanel>
            <TabPanel value={valueTab} index={0}>
              <Box sx={{ width: "100%", backgroundColor: "#FFF" }}>
                {data?.itens ? (
                  <DataGrid
                    rows={
                      valuesFiltered?.length > 0 ? valuesFiltered : data.itens
                    }
                    columns={columns}
                    hideFooterPagination
                    checkboxSelection
                    disableSelectionOnClick
                    density="compact"
                    hideFooter
                    components={{ Toolbar: QuickSearchToolbar }}
                    componentsProps={{
                      baseTooltip: {
                        style: { color: "#4887C8", fontWeight: "bold" },
                      },
                    }}
                    paginationMode="server"
                    experimentalFeatures={{ newEditingApi: true }}
                    style={{
                      height: "70vh",
                    }}
                  />
                ) : null}
              </Box>
              {/* <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead sx={{backgroundColor: '#F5F5F5'}}>
                    <TableRow>
                    <TableCell align="center" sx={{color: '#4887C8'}}>
                      <Checkbox />
                    </TableCell>
                      {
                        data.length > 0 ? Object.keys(data[0]).map((headerValue) => (
                          <TableCell align="center" sx={{color: '#4887C8'}}>{headerValue}</TableCell>
                        )) : null
                      }
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      data.length > 0 ? data.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align="center">
                            <Checkbox />
                          </TableCell>
                          {
                            Object.values(item).map((value, index) => (
                              <TableCell align="center" key={index}>{value ?? "não informado"}</TableCell>
                            ))
                          }
                        </TableRow>
                      )) : null
                    }
                  </TableBody>
                </Table>
              </TableContainer> */}
              <Box
                sx={{
                  backgroundColor: "#F5F5F5",
                  display: "flex",
                  justifyContent: "right",
                  py: 2,
                  gap: "1rem",
                  position: "absolute",
                  width: "100%",
                  left: 0,
                  bottom: 0,
                }}
              >
                <Button
                  // disabled

                  onClick={() => navigate("cadastro", { replace: true })}
                >
                  Novo
                </Button>
                <Button
                  // disabled
                  onClick={() => handleClickOpen(4)}
                >
                  Exportar
                </Button>
                <Button
                  onClick={() => handleClickOpen(1)}
                  // disabled
                >
                  Filtrar
                </Button>
                <Button disabled sx={{ marginRight: 3 }}>
                  Voltar
                </Button>
              </Box>
              <ModalFilterAgremiacao />
              <ModalExportarAgremiacao />
              {/* <BackdropComponent open={isLoading} /> */}
            </TabPanel>
            <TabPanel value={valueTab} index={1}>
              <CadastroAgremiacao />
            </TabPanel>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}