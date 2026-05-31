import { PageResult } from "../config/listing/listing.dto";
import { PROFILE, SITUATION } from "./enum.dto";

export interface IUsuario {
  id: number;
  nome: string;
  email: string;
  perfil: keyof typeof PROFILE;
  situacao: keyof typeof SITUATION;
  createdAt: string;
}

export interface CreateUsuarioDto {
  nome: string;
  email: string;
  perfil: string;
  situacao: string;
  senha: string;
}

export interface UpdateUsuarioDto {
  nome: string;
  email: string;
  perfil: string;
  situacao: string;
  senha?: string;
}

export type UsuariosResponse = PageResult<IUsuario>;
