import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BlockBlobClient } from "@azure/storage-blob";
import { useDebounce } from "../utils/useDebounce";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

import type { IAgremiacao } from "../models/AgremiacaoModel";
import type { FormikErrors } from "formik";

import {
  Grid,
  FormControlLabel,
  Checkbox,
  IconButton,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  Divider,
  Input,
  Link,
  Stepper,
  Step,
  StepLabel,
  Box,
} from "@mui/material";

import { StyledButton as Button } from "../components/Button";

import {
  CreateOutlined as CreateOutlinedIcon,
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
  AddPhotoAlternateOutlined as AddPhotoAlternateOutlinedIcon,
  ClearOutlined as ClearOutlinedIcon,
  SaveOutlined as SaveOutlinedIcon,
  AttachFileOutlined as AttachFileOutlinedIcon,
  NoteAddOutlined as NoteAddOutlinedIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";

import { agremiacaoRoutes } from "../providers/services/api/agremiacao";

import { ModalAnotacoesAgremiacao } from "../components/Modal/Agremiacao/Anotacoes";
import { ModalAnexosAgremiacao } from "../components/Modal/Agremiacao/Anexar";
import { useModal } from "../hooks/useModalProvider";
import { useAlertContext } from "../hooks/useAlertProvider";
import { useFormikProvider } from "../hooks/useFormikProvider";

import { values as InitialValues } from "../components/Form/Agremiacao/values/register";
import { validation as ValidationSchema } from "../components/Form/Agremiacao/validation/register";

import AvatarDefault from "../assets/photo-user-default.png";
import "../styles/cadastro-agremiacao.scss";
import { TabsAgremiacao } from "./Agremiacao/Tabs";
import { width } from "@mui/system";

export function CadastroAgremiacao() {
  const navigate = useNavigate();
  const { id: userId } = useParams<{ id: string }>();
  const id = userId ? Number.parseInt(userId) : undefined;
  const handleTypePage = id ? "Edição" : "Cadastro";
  document.title = `${handleTypePage} de Agremiação`;
  const [avatarPreview, setAvatarPreview] = useState<string>(AvatarDefault);

  const { handleClickOpen, handleClose } = useModal();
  const { emitAlertMessage } = useAlertContext();
  const { notes, setNotes, files, currentFileToCreate } = useFormikProvider();

  const [isValid, setIsValid] = useState(false);

  const onBlurForm = () => {
    if (formik.errors.sigla) {
      setIsValid(false);
    }
  };
  const queryClient = useQueryClient();

  const formik = useFormik({
    // validateOnChange: false,
    initialValues: InitialValues,
    validationSchema: Yup.object().shape(ValidationSchema),
    onSubmit: () => {
      // const valuesToPost = { ...formik.values, anotacoes: notes };
      // console.log('val post', valuesToPost)
      mutate();
    },
  });

  const onBlurCep = (e: { target: { value: string } }) => {
    const cep = e.target.value.replace(/\D/g, "");

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (!("erro" in data)) {
          formik.setFieldValue("endereco", data.logradouro);
          formik.setFieldValue("bairro", data.bairro);
        } else {
          formik.setFieldValue("endereco", "");
          formik.setFieldValue("bairro", "");
        }
      });
  };

  useEffect(() => {
    formik.values['anotacoes'] = notes
  }, [formik.isSubmitting]);
  const [count, setCount] = useState(0)

  useEffect(()=>{
    setCount(count+1)
  },[formik.isSubmitting])
  useEffect(()=>{
    if(formik.values['anotacoes']!= notes){
    let errorList = Object.keys(formik.errors);
    console.log("error list", errorList);
    console.log(notes)
    if (errorList.length > 0 ) {
      return emitAlertMessage("error", "Preencha os campos obrigatórios!");
      //   document.getElementsByName(errorList[0])[0].scrollIntoView();
    }
    formik.handleSubmit
    
  

  }
      
  },[count])

  const handleRoutes = () => {
    if (id) {
      const valuesToPost = {
        ...formik.values,
        anotacoes: notes,
      };
  
      console.log("update this" + currentFileToCreate);
      //@ts-ignore
      return agremiacaoRoutes.updateAgremiacao(valuesToPost);
    }
    for (const [key, value] of Object.entries(formik.values)) {
      if (key === "id") {
        delete formik.values[key];
      }
    }

    const valuesToPost = {
      ...formik.values,
      Documentos: [...currentFileToCreate],
      anotacoes: notes,
    };

    console.log("formik values", formik.values);
    console.log("values to post", valuesToPost);
    //@ts-ignore
    return agremiacaoRoutes.createAgremiacao(valuesToPost);
  };

  //@ts-ignore
  const { isLoading, mutate } = useMutation(() => handleRoutes(), {
    onSuccess: () => {
      //@ts-ignore
      queryClient.invalidateQueries("agremiacao-list");
      const successMsg = id
        ? "Agremiação editada com sucesso!"
        : "Agremiação cadastrada com sucesso!";
      emitAlertMessage("success", successMsg);
      navigate("/agremiacao");
    },
    onError: () => {
      const errorMsg = id
        ? "Erro ao editar agremiação"
        : "Erro ao cadastrar agremiação";
      emitAlertMessage("error", errorMsg);
    },
  });

  const handleUpdateFormikRegisterValues = async () => {
    if (id === undefined) return;
    const response = await agremiacaoRoutes.getAgremiacao(id);
    console.log(response)
    if (response.foto) {
      const client = new BlockBlobClient(response.foto);
      const blob = await client.download();
      const blobResponse = await blob.blobBody;
      if (blobResponse) {
        setAvatarPreview(URL.createObjectURL(blobResponse));
        console.log("######", avatarPreview);
      }
    }
    // console.log('response edit', response)
    formik.setValues(response);
  };

  useEffect(() => {
    //@ts-ignore
    window.addEventListener("load", handleUpdateFormikRegisterValues());
    return () => {
      //@ts-ignore
      window.removeEventListener("load", handleUpdateFormikRegisterValues());
    };
  }, []);

  // const handleAddAnotation = () => {
  //     formik.setFieldValue('anotacoes', notes)
  //     console.log('register val anotation', notes)
  //     console.log('formik val after anotation', formik.values)
  //     handleClose();
  // }

  const handleDeleteAgremiacao = () => {
    Swal.fire({
      title: "Tem certeza que deseja excluir?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        //@ts-ignore
        agremiacaoRoutes.deleteAgremiacao(id);
        //@ts-ignore
        queryClient.invalidateQueries("agremiacao-list");
        formik.setValues(InitialValues);
        emitAlertMessage("success", "Agremiação excluída com sucesso!");

        navigate("/agremiacao");
      }
    });
  };
  useEffect(()=>{
    console.log(avatarPreview);
    
  },[avatarPreview])

  return (
    <form
      onSubmit={formik.handleSubmit}
      encType="multipart/form-data"
      autoComplete="off"
    >
      {id ? <TabsAgremiacao /> : null}
      <div
        id="cadastro"
        style={{
          marginTop: id !== undefined ? 40 : 0,
          height: id !== undefined ? "77vh" : "80vh",
        }}
      >
        <Grid container spacing={2} sx={{ display: "flex" }}>
          <Grid item xs={2}>
            <img
              //@ts-ignore
              src={avatarPreview || formik.values.foto}
              alt="Foto do agremiado"
              id="image-upload"
            />
            <div id="image-upload-actions">
              <InputLabel htmlFor="foto" sx={{ color: "black" }}>
                <Input
                  type="file"
                  id="foto"
                  name="foto"
                  inputProps={{ accept: "image/*" }}
                  onChange={(e) => {
                    const fileReader = new FileReader();
                    fileReader.onload = () => {
                      if (fileReader.readyState === 2) {
                        if (
                          fileReader.result === null ||
                          typeof fileReader.result !== "string"
                        )
                          return;
                        // setAvatarPreview(fileReader.result)
                        setAvatarPreview(fileReader.result);
                      }
                    };

                    const input = e.target as HTMLInputElement;
                    if (!input.files?.length) return;
                    formik.setFieldValue("foto", input.files[0]);
                    fileReader.readAsDataURL(input.files[0]);
                  }}
                  sx={{ display: "none" }}
                />
                <IconButton aria-label="upload picture" component="span">
                  <AddPhotoAlternateOutlinedIcon />
                </IconButton>
              </InputLabel>

              <InputLabel htmlFor="foto" sx={{ color: "black" }}>
                <Input
                  type="file"
                  id="foto"
                  name="foto"
                  inputProps={{ accept: "image/*" }}
                  onChange={(e) => {
                    const fileReader = new FileReader();
                    fileReader.onload = () => {
                      if (fileReader.readyState === 2) {
                        if (
                          fileReader.result === null ||
                          typeof fileReader.result !== "string"
                        )
                          return;
                        // setAvatarPreview(fileReader.result)
                        setAvatarPreview(fileReader.result);
                      }
                    };

                    const input = e.target as HTMLInputElement;
                    if (!input.files?.length) return;
                    formik.setFieldValue("foto", input.files[0]);
                    fileReader.readAsDataURL(input.files[0]);
                  }}
                  sx={{ display: "none" }}
                />

                <IconButton aria-label="upload picture" component="span">
                  <CreateOutlinedIcon />
                </IconButton>
              </InputLabel>

{/* 
              <InputLabel htmlFor="button" sx={{ color: "black" }} >
                <Input
                  type="button"
                  id="foto"
                  name="foto"
                  onClick={() => {
                    console.log('oi')
                    setAvatarPreview(AvatarDefault);
                    formik.setFieldValue("foto",  null );
                  }}
                  sx={{ display: "none" }}
                /> */}

                <IconButton aria-label="upload picture" component="span" onClick={()=> {
                  setAvatarPreview(AvatarDefault)
                  formik.setFieldValue('foto',null)}
                  }>
                <DeleteOutlineOutlinedIcon />
                </IconButton>

            </div>
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={2} sx={{ width: "600px" }}>
              <Grid item xs={4}>
                <TextField
                  type="text"
                  label="Sigla *"
                  name="sigla"
                  id="sigla"
                  value={formik.values["sigla"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["sigla"] && Boolean(formik.errors["sigla"])
                  }
                  helperText={formik.touched["sigla"] && formik.errors["sigla"]}
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={4}></Grid>

              <Grid item xs={4}>
                <TextField
                  type="date"
                  label="Data Filiação *"
                  name="dataFiliacao"
                  id="dataFiliacao"
                  value={formik.values["dataFiliacao"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["dataFiliacao"] &&
                    Boolean(formik.errors["dataFiliacao"])
                  }
                  helperText={
                    formik.touched["dataFiliacao"] &&
                    formik.errors["dataFiliacao"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="text"
                  label="Nome *"
                  name="nome"
                  id="nome"
                  value={formik.values["nome"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["nome"] && Boolean(formik.errors["nome"])
                  }
                  helperText={formik.touched["nome"] && formik.errors["nome"]}
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="text"
                  label="Fantasia *"
                  name="fantasia"
                  id="fantasia"
                  value={formik.values["fantasia"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["fantasia"] &&
                    Boolean(formik.errors["fantasia"])
                  }
                  helperText={
                    formik.touched["fantasia"] && formik.errors["fantasia"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="text"
                  label="Responsável *"
                  name="responsavel"
                  id="responsavel"
                  value={formik.values["responsavel"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["responsavel"] &&
                    Boolean(formik.errors["responsavel"])
                  }
                  helperText={
                    formik.touched["responsavel"] &&
                    formik.errors["responsavel"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="text"
                  label="Representante *"
                  name="representante"
                  id="representante"
                  value={formik.values["representante"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["representante"] &&
                    Boolean(formik.errors["representante"])
                  }
                  helperText={
                    formik.touched["representante"] &&
                    formik.errors["representante"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  type="date"
                  label="Data de nascimento *"
                  name="dataNascimento"
                  value={formik.values["dataNascimento"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["dataNascimento"] &&
                    Boolean(formik.errors["dataNascimento"])
                  }
                  helperText={
                    formik.touched["dataNascimento"] &&
                    formik.errors["dataNascimento"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={4}></Grid>

              <Grid item xs={4}>
                <TextField
                  select
                  label="Região *"
                  name="idRegiao"
                  id="idRegiao"
                  value={formik.values["idRegiao"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["idRegiao"] &&
                    Boolean(formik.errors["idRegiao"])
                  }
                  helperText={
                    formik.touched["idRegiao"] && formik.errors["idRegiao"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  <MenuItem value={1}>Nordeste</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} style={{ width: "50%" }}>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  textAlign="left"
                >
                  Contatos
                </Typography>
              </Grid>

              <Grid item xs={3}>
                <TextField
                  type="text"
                  label="CEP *"
                  name="cep"
                  id="cep"
                  value={formik.values["cep"]}
                  onChange={formik.handleChange}
                  onBlur={formik.errors.cep ? formik.handleBlur : onBlurCep}
                  error={formik.touched["cep"] && Boolean(formik.errors["cep"])}
                  helperText={formik.touched["cep"] && formik.errors["cep"]}
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={2}>
                <Link
                  href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                  variant="body2"
                  target="_blank"
                >
                  Buscar CEP
                </Link>
              </Grid>

              <Grid item xs={7}>
                <TextField
                  type="text"
                  label="Endereço *"
                  name="endereco"
                  id="endereco"
                  value={formik.values["endereco"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["endereco"] &&
                    Boolean(formik.errors["endereco"])
                  }
                  helperText={
                    formik.touched["endereco"] && formik.errors["endereco"]
                  }
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="text"
                  label="Complemento*"
                  name="complemento"
                  id="complemento"
                  value={formik.values["complemento"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["complemento"] &&
                    Boolean(formik.errors["complemento"])
                  }
                  helperText={
                    formik.touched["complemento"] &&
                    formik.errors["complemento"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="text"
                  label="Bairro *"
                  name="bairro"
                  id="bairro"
                  value={formik.values["bairro"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["bairro"] && Boolean(formik.errors["bairro"])
                  }
                  helperText={
                    formik.touched["bairro"] && formik.errors["bairro"]
                  }
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={2}>
                <TextField
                  select
                  label="Cidade"
                  name="idCidade"
                  id="idCidade"
                  value={formik.values["idCidade"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["idCidade"] &&
                    Boolean(formik.errors["idCidade"])
                  }
                  helperText={
                    formik.touched["idCidade"] && formik.errors["idCidade"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  <MenuItem value={1}>Fortaleza</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={2}>
                <TextField
                  select
                  label="Estado"
                  name="idEstado"
                  id="idEstado"
                  value={formik.values["idEstado"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["idEstado"] &&
                    Boolean(formik.errors["idEstado"])
                  }
                  helperText={
                    formik.touched["idEstado"] && formik.errors["idEstado"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  <MenuItem value={1}>Ceará</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={2}>
                <TextField
                  select
                  label="País"
                  name="idPais"
                  id="idPais"
                  value={formik.values["idPais"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["idPais"] && Boolean(formik.errors["idPais"])
                  }
                  helperText={
                    formik.touched["idPais"] && formik.errors["idPais"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  <MenuItem value={1}>Brasil</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={3}>
                <TextField
                  type="text"
                  label="Telefone *"
                  name="telefone"
                  id="telefone"
                  value={formik.values["telefone"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["telefone"] &&
                    Boolean(formik.errors["telefone"])
                  }
                  helperText={
                    formik.touched["telefone"] && formik.errors["telefone"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={5}>
                <TextField
                  type="email"
                  label="Email *"
                  name="email"
                  id="email"
                  value={formik.values["email"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["email"] && Boolean(formik.errors["email"])
                  }
                  helperText={formik.touched["email"] && formik.errors["email"]}
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} sx={{ width: "800px" }}>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  textAlign="left"
                >
                  Documentos
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="text"
                  label="CNPJ *"
                  name="cnpj"
                  id="cnpj"
                  value={formik.values["cnpj"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["cnpj"] && Boolean(formik.errors["cnpj"])
                  }
                  helperText={formik.touched["cnpj"] && formik.errors["cnpj"]}
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  type="date"
                  label="Data CNPJ *"
                  name="dataCnpj"
                  id="dataCnpj"
                  value={formik.values["dataCnpj"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["dataCnpj"] &&
                    Boolean(formik.errors["dataCnpj"])
                  }
                  helperText={
                    formik.touched["dataCnpj"] && formik.errors["dataCnpj"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="text"
                  label="Inscrição Municipal *"
                  name="inscricaoMunicipal"
                  id="inscricaoMunicipal"
                  value={formik.values["inscricaoMunicipal"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["inscricaoMunicipal"] &&
                    Boolean(formik.errors["inscricaoMunicipal"])
                  }
                  helperText={
                    formik.touched["inscricaoMunicipal"] &&
                    formik.errors["inscricaoMunicipal"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="text"
                  label="Inscrição Estadual *"
                  name="inscricaoEstadual"
                  id="inscricaoEstadual"
                  value={formik.values["inscricaoEstadual"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["inscricaoEstadual"] &&
                    Boolean(formik.errors["inscricaoEstadual"])
                  }
                  helperText={
                    formik.touched["inscricaoEstadual"] &&
                    formik.errors["inscricaoEstadual"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  type="date"
                  label="Data ATA *"
                  name="dataAta"
                  id="dataAta"
                  value={formik.values["dataAta"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched["dataAta"] &&
                    Boolean(formik.errors["dataAta"])
                  }
                  helperText={
                    formik.touched["dataAta"] && formik.errors["dataAta"]
                  }
                  size="small"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="alvaraLocacao"
                    id="alvaraLocacao"
                    checked={formik.values["alvaraLocacao"]}
                    onChange={formik.handleChange}
                  />
                }
                label="Alvará de locação"
                labelPlacement="start"
              />
            </Grid>

            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="estatuto"
                    id="estatuto"
                    checked={formik.values["estatuto"]}
                    onChange={formik.handleChange}
                  />
                }
                label="Estatuto"
                labelPlacement="start"
              />
            </Grid>

            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="contratoSocial"
                    id="contratoSocial"
                    checked={formik.values["contratoSocial"]}
                    onChange={formik.handleChange}
                  />
                }
                label="Contrato Social"
                labelPlacement="start"
              />
            </Grid>

            <Grid item xs={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="documentacaoAtualizada"
                    id="documentacaoAtualizada"
                    checked={formik.values["documentacaoAtualizada"]}
                    onChange={formik.handleChange}
                  />
                }
                label="Documentação Atualizada"
                labelPlacement="start"
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Box
        sx={{
          backgroundColor: "#F5F5F5",
          display: "flex",
          justifyContent: "right",
          py: 1,
          gap: "1rem",
          position: "absolute",
          width: "100vw",
          left: 0,
          bottom: 0,
        }}
      >
        <Button color="success" type="submit">
          <SaveOutlinedIcon />
          Salvar
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleClickOpen(3);
          }}
        disabled = {Object.keys(formik.errors).length> 1 || isValid}

          // disabled
        >
          <AttachFileOutlinedIcon />
          Anexar
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleClickOpen(2);
          }}
        >
          <NoteAddOutlinedIcon />
          Anotações
        </Button>
        <Button
          type="button"
          style={{ marginRight: id !== undefined ? 0 : 38 }}
          onClick={(e) => {
            formik.handleReset(e);
            setAvatarPreview(AvatarDefault);
            navigate("/agremiacao");
          }}
        >
          <ClearOutlinedIcon />
          Cancelar
        </Button>
        {id !== undefined ? (
          <Button
            type="button"
            onClick={handleDeleteAgremiacao}
            color="error"
            style={{ marginRight: 38 }}
          >
            <DeleteIcon />
            Excluir
          </Button>
        ) : null}
      </Box>
      <ModalAnexosAgremiacao />
      {id ? (
        <ModalAnotacoesAgremiacao
          currentNotes={formik.values.anotacoes}
          agremiacaoId={id ?? 0}
        />
      ) : (
        <ModalAnotacoesAgremiacao agremiacaoId={id ?? 0} isRegister={true} />
      )}
    </form>
  );
}
