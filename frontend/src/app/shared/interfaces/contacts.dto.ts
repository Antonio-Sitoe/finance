export interface IContactDTO {
  id: number;
  nome: string;
  departamento: string;
  email: string;
  telefone: string;
  situacao: "ATIVO" | "INATIVO";
  clienteId: number;
  clienteNome: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContactPayloadDTO {
  nome: string;
  departamento: string;
  email: string;
  telefone: string;
  situacao: "ATIVO" | "INATIVO";
  clienteId: number | string;
}
