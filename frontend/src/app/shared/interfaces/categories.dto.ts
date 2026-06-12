import { Situacao } from "@/shared/interfaces/enum.dto";

export interface ICategory {
  id: number;
  nome: string;
  debito: boolean;
  credito: boolean;
  categoriaPaiId: number | null;
  categoriaPaiNome: string | null;
  descricao: string | null;
  situacao: Situacao;
}

export interface ICategoryPayload {
  nome: string;
  debito: boolean;
  credito: boolean;
  categoriaPaiId?: number;
  descricao?: string;
  situacao: Situacao;
}

export interface ICategoryOption {
  id: number;
  nome: string;
}

export interface ICategorySituacaoResponse {
  id: number;
  situacao: Situacao;
  mensagem: string;
}
