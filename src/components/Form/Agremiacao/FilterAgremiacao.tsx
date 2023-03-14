import { Formik, useFormik } from "formik";
import * as Yup from "yup";

import { MenuItem, Paper, Stack, TextField, Box } from "@mui/material";
import { Add, Close } from "@mui/icons-material";

import type { IFiltersAgremicao } from "../../../models/AgremiacaoModel";
import { AgremiacaoOptions } from "../../../models/AgremiacaoModel";

import { useFormikProvider } from "../../../hooks/useFormikProvider";
import { useEffect, useState } from "react";
import { InitialParenthesesValue } from "../../../types/Filters/Agremiacao/parentheses";
import { beBY } from "@mui/material/locale";

interface FormFilterAgremiacaoProps {
  values?: IFiltersAgremicao;
  indexValues?: number;
}

export function FormFilterAgremiacao({
  values,
  indexValues,
}: FormFilterAgremiacaoProps) {
  // verify, if operator != between, then secondValue is not required

  const { filtersAgremiacao, setFiltersAgremiacao } = useFormikProvider();

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      initialParentheses: "",
      column: "",
      firstValue: "",
      operator: "",
      secondValue: "",
      finalParentheses: "",
      logicOperator: "",
    },
    validationSchema: Yup.object().shape({
      initialParentheses: Yup.string().notRequired(),
      column: Yup.string().required("Campo obrigatório"),
      firstValue: Yup.string().required("Campo obrigatório"),
      operator: Yup.string().required("Campo obrigatório"),
      secondValue: Yup.string().notRequired(), //.required('Campo obrigatório')
      finalParentheses: Yup.string().notRequired(),
      logicOperator: Yup.string().notRequired(), //.required('Campo obrigatório')
    }),
    onSubmit: (values: IFiltersAgremicao) => {
      const newArrayFiltersWithoutSort = [...filtersAgremiacao, values];
      setFiltersAgremiacao(
        newArrayFiltersWithoutSort.sort(
          (a: IFiltersAgremicao, b: IFiltersAgremicao) =>
            a.initialParentheses > b.initialParentheses
              ? 1
              : b.initialParentheses > a.initialParentheses
              ? -1
              : 0
        )
      );
      formik.resetForm();
    },
  });

  function handleDateFormat(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate() + 1;

    const month = date.getMonth() + 1;

    const year = date.getFullYear();
    const text = `${day > 10 ? day : "0" + day}/${
      month > 10 ? month : "0" + month
    }/${year}`;
    if( text== '0NaN/0NaN/NaN'){
      return dateString
    } else 
    return text
  }

  const handleRemoveFilter = () => {
    const newArrayFilters = filtersAgremiacao.filter((_, index) => index !== indexValues);

    setFiltersAgremiacao(newArrayFilters);
  }
  useEffect(()=> {
    console.log(filtersAgremiacao)
  },[filtersAgremiacao])

  const HandleRenderButtons = () => {
    if (values) {
      return (
        <Box display='flex' alignItems='center' sx={{ gap: 2 }}>
        <Close
          sx={{ color: 'transparent' }}
          onClick={handleRemoveFilter}
        />
          <Close
            sx={{ cursor: 'pointer' }}
            onClick={handleRemoveFilter}
          />
        </Box>
      )
    }
    return (
      <Box display='flex' alignItems='center' sx={{ gap: 2 }}>
        <Add
          sx={{ color: 'green', cursor: 'pointer' }}
          onClick={(e: any) => formik.handleSubmit(e)}
        />
        <Close
          sx={{ color: 'red', cursor: 'pointer' }}
          onClick={(e: any) => formik.handleReset(e)}
        />
      </Box>
    );
  }

  const HandleRenderForm = () => {
    return (
      <form>
      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          m: 3
        }}
        >
          <TextField
            select
            variant="outlined"
            name='initialParentheses'
            id='initialParentheses'
            value={values?.initialParentheses ?? formik.values['initialParentheses']}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched['initialParentheses'] && Boolean(formik.errors['initialParentheses'])}
            helperText={formik.touched['initialParentheses'] && formik.errors['initialParentheses']}
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
          >
            {
              AgremiacaoOptions.AgremiacaoParenthesesValues
                .initial.map((parentheses: { value: string, label: string }) => (
                  <MenuItem value={parentheses.value}>{parentheses.label}</MenuItem>
                ))
            }
          </TextField>

          <TextField
            select
            variant="outlined"
            name='column'
            id='column'
            value={values?.column ?? formik.values['column']}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched['column'] && Boolean(formik.errors['column'])}
            helperText={formik.touched['column'] && formik.errors['column']}
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {
              AgremiacaoOptions.AgremiacaoHeaderValues.map((item) => (
                <MenuItem value={item.value}>{item.label}</MenuItem>
              ))
            }
          </TextField>

          <TextField
            select
            variant="outlined"
            name='operator'
            id='operator'
            value={values?.operator ?? formik.values['operator']}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched['operator'] && Boolean(formik.errors['operator'])}
            helperText={formik.touched['operator'] && formik.errors['operator']}
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
            
          >
            {
              AgremiacaoOptions.AgremiacaoOperatorsValues
                .operator.map((operator) => (
                  <MenuItem value={operator.value}>{operator.label}</MenuItem>
                ))
            }
          </TextField>

          <TextField
            type='text'
            variant="outlined"
            name='firstValue'
            id='firstValue'
            value={!isColumnDate ?  (values?.firstValue && handleDateFormat(values?.firstValue)) ?? formik.values['firstValue'] : values?.firstValue ?? formik.values['firstValue'] }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched['firstValue'] && Boolean(formik.errors['firstValue'])}
            helperText={formik.touched['firstValue'] && formik.errors['firstValue']}
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            type='text'
            variant="outlined"
            name='secondValue'
            id='secondValue'
            value={values?.secondValue ?? formik.values['secondValue']}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched['secondValue'] && Boolean(formik.errors['secondValue'])}
            helperText={formik.touched['secondValue'] && formik.errors['secondValue']}
            sx={{ width: 150 }}
            fullWidth
            disabled={formik.values['operator'] !== 'ENTRE' || values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            select
            variant="outlined"
            name='finalParentheses'
            id='finalParentheses'
            value={values?.finalParentheses ?? formik.values['finalParentheses']}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched['finalParentheses'] && Boolean(formik.errors['finalParentheses'])}
            helperText={formik.touched['finalParentheses'] && formik.errors['finalParentheses']}
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {
              AgremiacaoOptions.AgremiacaoParenthesesValues
                .final.map((parentheses) => (
                  <MenuItem value={parentheses.value}>{parentheses.label}</MenuItem>
                ))
            }
          </TextField>

          <TextField
            select
            variant="outlined"
            name='logicOperator'
            id='logicOperator'
            value={values?.logicOperator ?? formik.values['logicOperator']}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched['logicOperator'] && Boolean(formik.errors['logicOperator'])}
            helperText={formik.touched['logicOperator'] && formik.errors['logicOperator']}
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {
              AgremiacaoOptions.AgremiacaoOperatorsValues
                .logicOperator.map((operator) => (
                  <MenuItem value={operator.value}>{operator.label}</MenuItem>
                ))
            }
          </TextField>

          <HandleRenderButtons />
        </Stack>
      </form>
    );
  }

  useEffect(() => {
    const a = formik.getFieldProps("initialParentheses").value;
    switch (a) {
      case "(":
        formik.setFieldValue("finalParentheses", ")");
        break;

      case "((":
        formik.setFieldValue("finalParentheses", "))");
        break;

      case "(((":
        formik.setFieldValue("finalParentheses", ")))");
        break;
    }
  }, [formik.values["initialParentheses"]]);
  
  useEffect(() => {
    if(
    formik.values["column"] == "DataCnpj" ||
    formik.values["column"] == "DataAta" ||
    formik.values["column"] == "DataFiliacao" ||
    formik.values["column"] == "DataNascimento"
    ){

    }
  }, [formik.values["column"]]);

  const [isColumnDate, setisColumnDate] = useState(false)
  const [isColumnNumber, setIsColumnNumber] = useState(false)
  useEffect(() => {
    const a = formik.getFieldProps("column").value; 
    if(
      a == "DataCnpj" ||
      a == "DataAta" ||
      a == "DataFiliacao" ||
      a == "DataNascimento"
    ){
      setisColumnDate(true)
      return
    }
    else{
      setisColumnDate(false)
      if(
        a == 'Cep' ||
        a == 'Cnpj' ||
        a == 'InscricaoMunicipal' ||
        a == 'InscricaoEstadual'
      ){
        setIsColumnNumber(true)
        return
      }else{
        setIsColumnNumber(false)
      }
    }
  }, [formik.values["column"]]);

  return values !== undefined ? (
    <HandleRenderForm />
  ) : (
    <Paper sx={{ alignItems: "center", p: 1, mb: 2 }}>
      <form>
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            m: 2,
          }}
        >
          <TextField
            select
            variant="outlined"
            label="Abre ("
            name="initialParentheses"
            id="initialParentheses"
            value={formik.values["initialParentheses"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched["initialParentheses"] &&
              Boolean(formik.errors["initialParentheses"])
            }
            helperText={
              formik.touched["initialParentheses"] &&
              formik.errors["initialParentheses"]
            }
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {AgremiacaoOptions.AgremiacaoParenthesesValues.initial.map(
              (parentheses: { value: string; label: string }) => (
                <MenuItem value={parentheses.value}>
                  {parentheses.label}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            select
            variant="outlined"
            label="Campo"
            name="column"
            id="column"
            value={formik.values["column"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched["column"] && Boolean(formik.errors["column"])}
            helperText={formik.touched["column"] && formik.errors["column"]}
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {AgremiacaoOptions.AgremiacaoHeaderValues.map((item) => (
              <MenuItem value={item.value}>{item.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            variant="outlined"
            label="Operador Lógico"
            name="operator"
            id="operator"
            value={formik.values["operator"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched["operator"] && Boolean(formik.errors["operator"])
            }
            helperText={formik.touched["operator"] && formik.errors["operator"]}
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {
              !isColumnDate ?
              AgremiacaoOptions.AgremiacaoOperatorsValues.operator.map(
                (operator) => (
                  <MenuItem value={operator.value}>{operator.label}</MenuItem>
                )
            ) : AgremiacaoOptions.AgremiacaoOperatorsValues.operatorData.map(
              (operator) => (
                <MenuItem value={operator.value}>{operator.label}</MenuItem>
              )
          )
          
            }
          </TextField>

          <TextField
            type= {isColumnDate ? "date" : isColumnNumber ? "number" : "text"}
            variant="outlined"
            label={"Valor 1"}
            name="firstValue"
            id="firstValue"
            value={formik.values["firstValue"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched["firstValue"] &&
              Boolean(formik.errors["firstValue"])
            }
            helperText={
              formik.touched["firstValue"] && formik.errors["firstValue"]
            }
            sx={{ width: 150 }}
            fullWidth
            InputProps={{
              inputProps: { min: 0 }
            }}
            disabled={values !== undefined}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            variant="outlined"
            type= {isColumnDate ? "date" : isColumnNumber ? "number" : "text"}
            label={"Valor 2"}
            name="secondValue"
            id="secondValue"
            value={formik.values["secondValue"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched["secondValue"] &&
              Boolean(formik.errors["secondValue"])
            }
            helperText={
              formik.touched["secondValue"] && formik.errors["secondValue"]
            }
            sx={{ width: 150 }}
            fullWidth
            disabled={
              formik.values["operator"] !== "ENTRE" || values !== undefined
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            select
            label="Fecha )"
            variant="outlined"
            name="finalParentheses"
            id="finalParentheses"
            value={formik.values["finalParentheses"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched["finalParentheses"] &&
              Boolean(formik.errors["finalParentheses"])
            }
            helperText={
              formik.touched["finalParentheses"] &&
              formik.errors["finalParentheses"]
            }
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
              width: 150,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            disabled
          >
            {AgremiacaoOptions.AgremiacaoParenthesesValues.final.map(
              (parentheses) => (
                <MenuItem value={parentheses.value}>
                  {parentheses.label}
                </MenuItem>
              )
            )}
          </TextField>
          <TextField
            select
            variant="outlined"
            name="logicOperator"
            id="logicOperator"
            value={formik.values["logicOperator"]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched["logicOperator"] &&
              Boolean(formik.errors["logicOperator"])
            }
            helperText={
              formik.touched["logicOperator"] && formik.errors["logicOperator"]
            }
            sx={{ width: 150 }}
            fullWidth
            disabled={values !== undefined}
          >
            {AgremiacaoOptions.AgremiacaoOperatorsValues.logicOperator.map(
              (operator) => (
                <MenuItem value={operator.value}>{operator.label}</MenuItem>
              )
            )}
          </TextField>
          {/*@ts-ignore */}
          <HandleRenderButtons />
        </Stack>
      </form>
    </Paper>
  );
}
