export type Page<T> = {
  paginacao: {
    total: number,
    totalNaPaginacao: number,
    pagina: number,
    tamanhoPagina: number,
    totalDePaginas: number,
  };
  itens: Array<T>;
};