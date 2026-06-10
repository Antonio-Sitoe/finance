import { Situacao } from "@/shared/interfaces/enum.dto";

export interface ISupplier {
  id: number;
  nomeEmpresarial: string;
  email?: string;
  telefone?: string;
  website?: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  nota?: number | null;
  situacao: Situacao;
}

export interface ISupplierPayload {
  nomeEmpresarial: string;
  email?: string;
  telefone?: string;
  website?: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  nota?: number;
  situacao: Situacao;
}

export interface ISupplierSituacaoResponse {
  id: number;
  situacao: Situacao;
  mensagem: string;
}

export interface ISupplierAnalytics {
  total: number;
  totalAtivos: number;
  totalInativos: number;
  altaConformidade: number;
}
