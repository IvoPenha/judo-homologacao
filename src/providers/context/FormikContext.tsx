import { SetStateAction, createContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import type { ReactNode } from "react";
import type {
  IAgremiacao,
  IFiltersAgremicao,
} from "../../models/AgremiacaoModel";

import { values as InitialValues } from "../../components/Form/Agremiacao/values/register";
import { validation as ValidationSchema } from "../../components/Form/Agremiacao/validation/register";

export type FilesTypes = {
  alvaraLocacao?: File;
  estatuto?: File;
  contratoSocial?: File;
  documentacaoAtualizada?: File;
};
interface FormikContextProps {
  AgremiacaoFilterFormik: any;
  AgremiacaoRegisterFormik: any;
  filtersAgremiacao: IFiltersAgremicao[];
  setFiltersAgremiacao: (filtersAgremiacao: IFiltersAgremicao[]) => void;
  filtersToPost: any;
  setFiltersToPost: React.Dispatch<SetStateAction<NewFilterFormattedProps[]>>;
  handleFilterChange: (newFilter: IFiltersAgremicao[]) => void;
  valuesFiltered: IAgremiacao[];
  setValuesFiltered: (valuesFiltered: IAgremiacao[]) => void;
  notes: string;
  setNotes: (notes: string) => void;
  files: FilesTypes;
  handleChangeFile: (file: FilesTypes) => void;
  currentFileToCreate: File[];
  setCurrentFileToCreate: React.Dispatch<SetStateAction<File[]>>;
}

import { agremiacaoRoutes } from "../services/api/agremiacao";
import { useAuthContext } from "../../hooks/useAuthProvider";

interface FormikProviderProps {
  children: ReactNode;
}

export const FormikContext = createContext({} as FormikContextProps);

interface NewFilterFormattedProps {
  nomeParametro: string;
  operacaoId: number;
  valorString?: string;
  valorId1?: number;
  valorId2?: number;
  dataInicial?: string;
  dataFinal?: string;
  operadorLogico: number;
  operacoesMatematicas: boolean;
}

export function FormikProvider({ children }: FormikProviderProps) {
  const [filtersAgremiacao, setFiltersAgremiacao] = useState<
    IFiltersAgremicao[]
  >([]);
  const [filtersToPost, setFiltersToPost] = useState<NewFilterFormattedProps[]>(
    []
  );
  const [currentFileToCreate, setCurrentFileToCreate] = useState<File[]>([]);
  const [newFilterFormatted, setNewFilterFormatted] = useState<
    NewFilterFormattedProps[]
  >([
    {
      nomeParametro: "Nome",
      operacaoId: 1,
      valorString: "",
      operacoesMatematicas: false,
      operadorLogico: 2,
    },
  ]);
  const [valuesFiltered, setValuesFiltered] = useState<IAgremiacao[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [files, setFiles] = useState<FilesTypes>({});
  const { verifyToken } = useAuthContext();

  useEffect(() => {
    verifyToken();
  }, []);


  const filterWithZeroReturn = {
      id: 1, 
      sigla: 'Sem Correspondencia',
      nome: 'Sem Correspondencia',
      fantasia: 'Sem Correspondencia',
      responsavel: 'Sem Correspondencia',
      representante: 'Sem Correspondencia',
      dataFiliacao: new Date(),
      dataNascimento:  new Date(),
      cep:  'Sem Correspondencia',
      endereco:  'Sem Correspondencia',
      bairro:  'Sem Correspondencia',
      complemento:  'Sem Correspondencia',
      cidade: 'Sem Correspondencia',
      estado: 'Sem Correspondencia',
      pais: 'Sem Correspondencia',
      telefone:  'Sem Correspondencia',
      email:  'Sem Correspondencia',
      cnpj:  'Sem Correspondencia',
      inscricaoMunicipal: 'Sem Correspondencia',
      inscricaoEstadual:  'Sem Correspondencia',
      dataCnpj:  new Date(),
      dataAta:  new Date(),
      foto:  'Sem Correspondencia',
      alvaraLocacao:  'Sem Correspondencia',
      estatuto:  'Sem Correspondencia',
      contratoSocial:  'Sem Correspondencia',
      documentacaoAtualizada:  'Sem Correspondencia',
      regiao:  'Sem Correspondencia',
      Documentos: []
    
  }

  const AgremiacaoFilterFormik = useFormik({
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
      initialParentheses: Yup.string().required("Campo obrigatório"),
      column: Yup.string().required("Campo obrigatório"),
      firstValue: Yup.string().required("Campo obrigatório"),
      operator: Yup.string().required("Campo obrigatório"),
      secondValue: Yup.string().notRequired(), //.required('Campo obrigatório')
      finalParentheses: Yup.string().required("Campo obrigatório"),
      logicOperator: Yup.string().notRequired(), //.required('Campo obrigatório')
    }),
    onSubmit: (values: IFiltersAgremicao) => {
      const newArrayFiltersWithoutSort = [...filtersAgremiacao, values];

      const newArrayFilters = newArrayFiltersWithoutSort.sort((a, b) => {
        switch (a.initialParentheses) {
          case "(":
            if (
              b.initialParentheses === "((" ||
              b.initialParentheses === "((("
            ) {
              return -1;
            }
            if (b.initialParentheses === "(") {
              return 0;
            }
          case "((":
            if (b.initialParentheses === "(") {
              return 1;
            }
            if (b.initialParentheses === "((") {
              return 0;
            }
            if (b.initialParentheses === "(((") {
              return -1;
            }
          case "(((":
            if (b.initialParentheses === "(" || b.initialParentheses === "((") {
              return 1;
            }
            if (b.initialParentheses === "(((") {
              return 0;
            }
          default:
            return 0;
        }
      });

      setFiltersAgremiacao(newArrayFilters);
      console.log("array filters in context", newArrayFilters);
      AgremiacaoFilterFormik.resetForm();
    },
  });

  const AgremiacaoRegisterFormik = useFormik({
    validateOnChange: false,
    initialValues: InitialValues,
    validationSchema: Yup.object().shape(ValidationSchema),
    onSubmit: async (values) => {
      const idForUpdate = values?.id;
      for (const [key, value] of Object.entries(values)) {
        if (key === "id") {
          delete values[key];
        }
      }
      //@ts-ignore
      const routeSelected = idForUpdate
      //@ts-ignore
        ? agremiacaoRoutes.updateAgremiacao(values, idForUpdate)
        //@ts-ignore
        : agremiacaoRoutes.createAgremiacao(values);
      const response = await routeSelected;
      AgremiacaoRegisterFormik.resetForm();
      console.log("response", response);
    },
  });

  const handleChangeFile = (newFile: FilesTypes) => {
    setFiles((currentFiles: FilesTypes) => ({
      ...currentFiles,
      ...newFile,
    }));
  };

  const handleFilterChange = (filters: IFiltersAgremicao[]) => {
    const operatorsOptions = ["", "CONTEM", "=", "#", "<", "<=", ">", ">=", 'ENTRE'];
    const logicOperatorsOptions = ["", "E", "OU"];

    function handleFormatFilter(filter: IFiltersAgremicao) {
      if (
        filter.column == "DataCnpj" ||
        filter.column == "DataAta" ||
        filter.column == "DataFiliacao" ||
        filter.column == "DataNascimento"
      ) {
        return {
          nomeParametro: filter.column,
          operacaoId: operatorsOptions.indexOf(filter.operator),
          dataInicial: filter.firstValue, //TODO: change to date
          dataFinal: filter.secondValue, //TODO: change to date
          operadorLogico: logicOperatorsOptions.indexOf(filter.logicOperator),
          operacoesMatematicas: true, //TODO: change to boolean
        };
      } else {
        return {
          nomeParametro: filter.column,
          operacaoId: operatorsOptions.indexOf(filter.operator),
          valorString: filter.firstValue,
          valorString2: filter.secondValue,
          operadorLogico: logicOperatorsOptions.indexOf(filter.logicOperator),
          operacoesMatematicas: false, //TODO: change to boolean
        };
      }
    }
    console.log('filters', filters)
    filters.map((filter) => {
      setFiltersToPost((old) =>
        old.length == 0
          ? [handleFormatFilter(filter)]
          : [...old, handleFormatFilter(filter)]
      );
    });
  };
  // useEffect(() => {
  //   setFiltersToPost((prev) => {
  //     return prev.length == 0
  //       ? [...prev, newFilterFormatted]
  //       : [newFilterFormatted];
  //   });
  // }, [newFilterFormatted]);

  useEffect(() => {
    console.log(filtersToPost);
    async function atribuittingApiValue() {
      const response = await agremiacaoRoutes.postAgremiacaoFilter(
        filtersToPost
      );
      if(response.itens.length == 0){
        setValuesFiltered([{...filterWithZeroReturn}])
      } else{
        setValuesFiltered(response.itens);

      }
    }
    atribuittingApiValue();

    // This code will be executed after filtersToPost has been updated
  }, [filtersToPost]);

  return (
    <FormikContext.Provider
      value={{
        AgremiacaoFilterFormik,
        AgremiacaoRegisterFormik,
        filtersAgremiacao,
        setFiltersAgremiacao,
        filtersToPost,
        setFiltersToPost,
        handleFilterChange,
        valuesFiltered,
        setValuesFiltered,
        notes,
        setNotes,
        files,
        handleChangeFile,
        currentFileToCreate,
        setCurrentFileToCreate
      }}
    >
      {children}
    </FormikContext.Provider>
  );
}
