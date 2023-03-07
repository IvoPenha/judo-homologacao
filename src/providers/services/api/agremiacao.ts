import { useState } from "react";
import { IAgremiacao } from "../../../models/AgremiacaoModel";
import type { Page } from "../../../types/page";

import api from "../api";
async function getAgremiacoes(filters?: any): Promise<Page<IAgremiacao>> {
  const response = await api.get(
    "/gerencia/agremiacao?Pagina=1&TamanhoPagina=64",
    { params: filters }
  );

  return response.data;
}

async function postAgremiacaoFilter(payload: any): Promise<Page<IAgremiacao>> {
  console.log(payload);
  const response = await api.post(
    "/gerencia/agremiacao/filtrar/agremiacao",
    payload
  );
  return response.data;
}

async function getAgremiacao(id: number) {
  const response = await api.get(`/gerencia/agremiacao/${id}`);

  return response.data;
}

async function createAgremiacao(payload: IAgremiacao): Promise<IAgremiacao> {
  const formData = new FormData();
  Object.keys(payload).forEach((key) => {
    // To pegando cada propriedade e mandando pro formData
    if (key == "Documentos")
      payload[key].map((item) => formData.append(key, item));
    //@ts-ignore
    else formData.append(key, payload[key]);
  });
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await api.post("gerencia/agremiacao", formData, config);

  return response.data;
}

async function updateAgremiacao(payload: IAgremiacao): Promise<IAgremiacao> {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await api.put(
    `/gerencia/agremiacao/${payload.id}`,
    payload,
    config
  );

  return response.data;
}

type AnotacaoObject = {
  anotacoes: string;
};

async function anotacoesAgremiacao(
  id: number,
  anotacao: AnotacaoObject
): Promise<void> {
  const response = await api.patch(`/gerencia/agremiacao/${id}`, anotacao);

  return response.data;
}

async function deleteAgremiacao(id: number): Promise<void> {
  const response = await api.delete(`/gerencia/agremiacao/${id}`);

  return response.data;
}

async function exportarAgremiacao(payload: any): Promise<any> {
  const response = await api.get("/gerencia/agremiacao/exportar", {
    params: payload,
  });

  return response.data;
}

async function anexarArquivoAgremiacao(
  id: number,
  payload: File[]
): Promise<any> {
  const formData = new FormData();
  payload.map((item) => {
    formData.append("Documentos", item);
  });
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await api.patch(
    `/gerencia/agremiacao/${id}/enviardocumentos`,
    formData,
    config
  );

  console.log(response);
  return response.data;
}

export const agremiacaoRoutes = {
  getAgremiacoes,
  postAgremiacaoFilter,
  getAgremiacao,
  createAgremiacao,
  updateAgremiacao,
  deleteAgremiacao,
  anotacoesAgremiacao,
  exportarAgremiacao,
  anexarArquivoAgremiacao,
};
