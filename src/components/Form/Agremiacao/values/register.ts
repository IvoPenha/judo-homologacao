interface InitialValuesAgremiacao {
  id?: number;
  sigla: string;
  nome: string;
  fantasia: string;
  responsavel: string;
  representante: string;
  dataFiliacao: string;
  dataNascimento: string;
  cep: string;
  endereco: string;
  bairro: string;
  complemento: string;
  idCidade: string;
  idEstado: string;
  idPais: string;
  telefone: string;
  email: string;
  cnpj: string;
  inscricaoMunicipal: string;
  inscricaoEstadual: string;
  dataCnpj: string;
  dataAta: string;
  foto: string | null;
  alvaraLocacao: boolean;
  estatuto: boolean;
  contratoSocial: boolean;
  documentacaoAtualizada: boolean;
  idRegiao: string;
  anotacoes: string;
}

export const values: InitialValuesAgremiacao = {
  sigla: '',
  nome: '',
  fantasia: '',
  responsavel: '',
  representante: '',
  dataFiliacao: '',
  dataNascimento: '',
  cep: '',
  endereco: '',
  bairro: '',
  complemento: '',
  idCidade: '',
  idEstado: '',
  idPais: '',
  telefone: '',
  email: '',
  cnpj: '',
  inscricaoMunicipal: '',
  inscricaoEstadual: '',
  dataCnpj: '',
  dataAta: '',
  foto: null,
  alvaraLocacao: false,
  estatuto: false,
  contratoSocial: false,
  documentacaoAtualizada: false,
  idRegiao: '',
  anotacoes: '',
}