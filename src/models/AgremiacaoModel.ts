import { Operator, LogicOperator } from "../types/Filters/Agremiacao/operator";
import { InitialParentheses, FinalParentheses } from "../types/Filters/Agremiacao/parentheses";

interface Agremiacaolocation{
  id: 0,
  sigla: string,
  descricao: string,
}
export interface IAgremiacao {
  id?: number,
  sigla: string,
  nome: string,
  fantasia: string,
  responsavel: string,
  representante: string,
  dataFiliacao: Date,
  dataNascimento: Date,
  cep: string,
  endereco: string,
  bairro: string,
  complemento: string,
  cidade: Agremiacaolocation,
  estado: Agremiacaolocation,
  pais: Agremiacaolocation,
  telefone: string,
  email: string,
  cnpj: string,
  inscricaoMunicipal: string,
  inscricaoEstadual: string,
  dataCnpj: Date,
  dataAta: Date,
  foto: File | string | null,
  alvaraLocacao: File | string | null,
  estatuto: File | string | null,
  contratoSocial: File | string | null,
  documentacaoAtualizada: File | string | null,
  regiao: Agremiacaolocation,
  anotacoes?: string,
  Documentos: []
}

export interface IFiltersAgremicao {
  initialParentheses: InitialParentheses | "";
  column: string;
  firstValue: string;
  operator: Operator | "";
  secondValue: string;
  finalParentheses: FinalParentheses | "";
  logicOperator: LogicOperator | "";
}

type AgremiacaoHeaderType = Array<{ value: string, label: string }>;

type AgremiacaoParenthesesType = {
  initial: Array<{ value: InitialParentheses, label: InitialParentheses }>;
  final: Array<{ value: FinalParentheses, label: FinalParentheses }>;
};

type AgremiacaoOperatorType = {
  operator: Array<{ value: Operator, label: Operator }>
  logicOperator: Array<{ value: LogicOperator, label: LogicOperator | 'vazio' }>;
};

const AgremiacaoHeaderValues: AgremiacaoHeaderType = [
  { value: 'Sigla', label: 'Sigla' },
  { value: 'Nome', label: 'Nome' },
  { value: 'Fantasia', label: 'Fantasia' },
  { value: 'Responsavel', label: 'Responsável' },
  { value: 'Representante', label: 'Representante' },
  { value: 'DataFiliacao', label: 'Data Filiação' },
  { value: 'DataNascimento', label: 'Data Nascimento' },
  { value: 'Cep', label: 'Cep' },
  { value: 'Endereco', label: 'Endereço' },
  { value: 'Bairro', label: 'Bairro' },
  { value: 'Complemento', label: 'Complemento' },
  { value: 'Cidade', label: 'Cidade' },
  { value: 'Estado', label: 'Estado' },
  { value: 'Pais', label: 'País' },
  { value: 'Telefone', label: 'Telefone' },
  { value: 'Email', label: 'Email' },
  { value: 'Cnpj', label: 'Cnpj' },
  { value: 'InscricaoMunicipal', label: 'Inscrição Municipal' },
  { value: 'InscricaoEstadual', label: 'Inscrição Estadual' },
  { value: 'DataCnpj', label: 'Data Cnpj' },
  { value: 'DataAta', label: 'Data Ata' },
  { value: 'AlvaraLocacao', label: 'Alvará Locação' },
  { value: 'Estatuto', label: 'Estatuto' },
  { value: 'ContratoSocial', label: 'Contrato Social' },
  { value: 'DocumentacaoAtualizada', label: 'Documentação Atualizada' },
  { value: 'Regiao', label: 'Região' },
  { value: 'Anotacoes', label: 'Anotações' },
]

const AgremiacaoParenthesesValues: AgremiacaoParenthesesType = {
  initial: [
    { value: '(', label: '(' },
    { value: '((', label: '((' },
    { value: '(((', label: '(((' },
  ],
  final: [
    { value: ')', label: ')' },
    { value: '))', label: '))' },
    { value: ')))', label: ')))' },
  ],
}

const AgremiacaoOperatorsValues: AgremiacaoOperatorType = {
  operator: [
    { value: 'CONTEM', label: 'CONTEM' },
    { value: '=', label: '=' },
    { value: '#', label: '#' },
    { value: '<', label: '<' },
    { value: '<=', label: '<=' },
    { value: '>', label: '>' },
    { value: '>=', label: '>=' },
    { value: 'ENTRE', label: 'ENTRE' },
  ],

  logicOperator: [
    { value: '', label: 'vazio' },
    { value: 'E', label: 'E' },
    { value: 'OU', label: 'OU' },
  ],
}

const AgremiacaoExportValues = [
  { value: 'Nome', label: 'Nome' },
  { value: 'Sigla', label: 'Sigla' },
  { value: 'Fantasia', label: 'Fantasia' },
  { value: 'Responsavel', label: 'Responsável' },
  { value: 'Representante', label: 'Representante' },
  { value: 'DataFiliacao', label: 'Data Filiação' },
  { value: 'DataNascimento', label: 'Data Nascimento' },
  { value: 'Cep', label: 'Cep' },
  { value: 'Endereco', label: 'Endereço' },
  { value: 'Bairro', label: 'Bairro' },
  { value: 'Complemento', label: 'Complemento' },
  { value: 'Cidade', label: 'Cidade' },
  { value: 'Estado', label: 'Estado' },
  { value: 'Pais', label: 'País' },
  { value: 'Telefone', label: 'Telefone' },
  { value: 'Email', label: 'Email' },
  { value: 'Cnpj', label: 'Cnpj' },
  // { value: 'inscricaoMunicipal', label: 'Inscrição Municipal' },
  // { value: 'inscricaoEstadual', label: 'Inscrição Estadual' },
  // { value: 'dataCnpj', label: 'Data Cnpj' },
  // { value: 'dataAta', label: 'Data Ata' },
  // { value: 'alvaraLocacao', label: 'Alvará Locação' },
  // { value: 'estatuto', label: 'Estatuto' },
  // { value: 'contratoSocial', label: 'Contrato Social' },
  // { value: 'documentacaoAtualizada', label: 'Documentação Atualizada' },
  { value: 'Regiao', label: 'Região' },
  // { value: 'anotacoes', label: 'Anotações' },
]

export const AgremiacaoOptions = {
  AgremiacaoExportValues,
  AgremiacaoHeaderValues,
  AgremiacaoParenthesesValues,
  AgremiacaoOperatorsValues,
};