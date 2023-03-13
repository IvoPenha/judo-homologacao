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
  ptBR,
} from "@mui/x-data-grid";
import { AddOutlined, CreateOutlined as EditIcon, Filter, FilterAlt, FilterAltOff, NoteAddOutlined, PlusOneOutlined, UploadFile } from "@mui/icons-material";

import {
  Search,
  FilterAltOffOutlined as FilterIcon,
} from "@mui/icons-material";

import { ModalFilterAgremiacao } from "../components/Modal/Agremiacao/modalFilterAgremiacao";
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
import parse from 'html-react-parser';
export function Listagem() {
  document.title = "Listagem de Agremiação";
  const navigate = useNavigate();
  const { handleClickOpen } = useModal();
  const { valuesFiltered, setValuesFiltered, setSelectedRowsAgremiacao, selectedRowsAgremiacao } = useFormikProvider();
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
          position: 'fixed',
          right: 8,
          top: 70
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
              agremiacaoRoutes.postClearFilters()
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
      width: 62,
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
          sx={{
            transform: 'scale(1)',
            ml: -1.5
          }}
          >
          <EditIcon />
        </Button>
      ),
      disableColumnMenu: true,
      hideSortIcons: true,
      
    },
    { field: "sigla", headerName: "Sigla", width: 120 },
    { field: "nome", headerName: "Nome", width: 300 },
    { field: "fantasia", headerName: "Fantasia", width: 300 },
    { field: "responsavel", headerName: "Responsável", width: 300 },
    { field: "representante", headerName: "Representante", width: 300 },
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
    { field: "bairro", headerName: "Bairro", width: 300 },
    { field: "complemento", headerName: "Complemento", width: 150 },

    {
      field: `${valuesFiltered.length == 0 ? "cidade" : "cidadeNome"}`,
      headerName: "Cidade",
      width: 200,
      valueGetter: ({ value }) =>
        valuesFiltered.length == 0 ? value?.descricao : value,
    },
    {
      field: `${valuesFiltered.length == 0 ? "estado" : "estadoNome"}`,
      headerName: "Estado",
      width: 150,
      valueGetter: ({ value }) =>
        valuesFiltered.length == 0 ? value?.descricao : value,
    },
    {
      field: `${valuesFiltered.length == 0 ? "pais" : "paisNome"}`,
      headerName: "Pais",
      width: 100,
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
    { field: "anotacoes", headerName: "Anotações", width: 500,valueFormatter: item => item.value != null ? item.value : ''  ,renderCell: (params) => params ?  parse(params.formattedValue) : '',
 },
  ];

  function handleSelectionModelChange(selection : any){
    setSelectedRowsAgremiacao(selection)
  }


  const [listaAgremiacao, setListaAgremiacao] = useState([{}]);
  useEffect(() => {
    console.log("lista", listaAgremiacao);
  }, [listaAgremiacao]);

  const customLocaleText = {
    footerTotalRows: `total de ${data?.itens.length} linhas`
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        height: {xl:'83vh', lg: '80vh'},
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: {xs: '1rem', xl: '1.5rem'},
        marginTop: {xs: '1.2rem', xl: '1.5rem'}
      }}
    >
      <Container maxWidth={false} >
        <Grid container spacing={1} >
          <TabsAgremiacao />
          <Grid item xs={12} >
            <TabPanel value={valueTab} index={2}>
              <Home />
            </TabPanel>
            <TabPanel value={valueTab} index={0}>
              <Box sx={{ width: "100%", backgroundColor: "#FFF", height: '74vh', flexGrow: 2, position: 'relative', zIndex: 2 }} >
                {data?.itens ? (
                  <DataGrid
                    rows={
                      valuesFiltered?.length > 0 ? valuesFiltered : data.itens
                    }
                    columns={columns}
                    checkboxSelection
                    disableSelectionOnClick
                    hideFooterPagination
                    disableColumnMenu
                    density="compact"
                    components={{ Toolbar: QuickSearchToolbar}}
                    rowsPerPageOptions={[25]}
                    localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                    componentsProps={{
                      baseTooltip: {
                        style: { color: "#4887C8", fontWeight: "bold" },
                      },
                      footer: {
                        sx: { color: "#4887C8", fontWeight: "bold", position:'fixed', bottom: 0}, 
                      },
                    
                    }}
                    experimentalFeatures={{ newEditingApi: true }}
                    style={{
                      height: "100%",
                    }}
                    onSelectionModelChange={handleSelectionModelChange}
                    selectionModel={selectedRowsAgremiacao}
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
                  py: '6px',
                  gap: "1rem",
                  maxHeight:'8vh' ,
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
                 <AddOutlined/> Novo
                </Button>
                <Button
                  // disabled
                  onClick={() => handleClickOpen(4)}
                >
                  <UploadFile/> Exportar
                </Button>
                <Button
                  onClick={() => handleClickOpen(1)}
                  // disabled
                >
                  <FilterAlt/> Filtrar
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
