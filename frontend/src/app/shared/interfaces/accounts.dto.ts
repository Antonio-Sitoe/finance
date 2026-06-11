import { Situacao } from "@/shared/interfaces/enum.dto";

export interface IAccount {
  id: number;
  nome: string;
  agencia: string;
  contaCorrente: string;
  observacao: string;
  dataInclusao: string;
  situacao: Situacao;
}

export interface IAccountPayload {
  nome: string;
  agencia: string;
  contaCorrente: string;
  observacao: string;
  situacao: Situacao;
}

export interface IAccountSituacaoResponse {
  id: number;
  situacao: Situacao;
  mensagem: string;
}
