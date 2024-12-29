export enum Status {
  Pending = "Pending",
  Completed = "Completed",
  Overdue = "Overdue"
}

export interface Tarefa {
  id: string;
  nome: string;
  descricao: string;
  dataValidade: string;
  concluido: boolean;
  status: Status;
}
