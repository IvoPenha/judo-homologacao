import * as Yup from 'yup';

export const validation = {
  sigla: Yup.boolean().notRequired(),
  nome: Yup.boolean().notRequired(),
  fantasia: Yup.boolean().notRequired(),
  responsavel: Yup.boolean().notRequired(),
  representante: Yup.boolean().notRequired(),
  dataFiliacao: Yup.boolean().notRequired(),
  dataNascimento: Yup.boolean().notRequired(),
  cep: Yup.boolean().notRequired(),
  endereco: Yup.boolean().notRequired(),
  bairro: Yup.boolean().notRequired(),
  complemento:  Yup.boolean().notRequired(),
  idCidade: Yup.boolean().notRequired(),
  idEstado: Yup.boolean().notRequired(),
  idPais: Yup.boolean().notRequired(),
  telefone: Yup.boolean().notRequired(),
  email: Yup.boolean().notRequired(),
  cnpj: Yup.boolean().notRequired(),
  inscricaoMunicipal: Yup.boolean().notRequired(),
  inscricaoEstadual: Yup.boolean().notRequired(),
  dataCnpj: Yup.boolean().notRequired(),
  dataAta: Yup.boolean().notRequired(),
  alvaraLocacao: Yup.boolean().notRequired(),
  estatuto: Yup.boolean().notRequired(),
  contratoSocial: Yup.boolean().notRequired(),
  documentacaoAtualizada: Yup.boolean().notRequired(),
  idRegiao: Yup.boolean().notRequired(),
  anotacoes: Yup.boolean().notRequired(),
}