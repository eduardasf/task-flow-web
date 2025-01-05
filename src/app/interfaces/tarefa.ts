import { Usuario } from "./usuario";

export enum Status {
  Pending = "Pending",
  Completed = "Completed",
  Overdue = "Overdue"
}

export class Tarefa {
  id: string;
  nome: string;
  descricao: string;
  dataValidade: string | Date;
  concluido: boolean;
  status: Status;
  usuarioId: string;
  usuario: Usuario;

  constructor(t: Tarefa) {
    this.id = t.id;
    this.nome = t.nome;
    this.descricao = t.descricao;
    this.dataValidade = t.dataValidade;
    this.concluido = t.concluido;
    this.status = t.status;
    this.usuario = t.usuario;
    this.usuarioId = t.usuarioId;
  }
}
