import { Tarefa } from "./tarefa";

export class Usuario {
  id: string;
  name: string;
  password?: string;
  email: string;
  tarefa?: Tarefa[];

  constructor(u: Usuario) {
    this.id = u.id;
    this.name = u.name;
    this.password = u.password;
    this.email = u.email
    this.tarefa = u.tarefa;
  }
}
export class CustomUsuario {
  id: string;
  name: string;
  email: string;

  constructor(u: Usuario) {
    this.id = u.id;
    this.name = u.name;
    this.email = u.email
  }
}
