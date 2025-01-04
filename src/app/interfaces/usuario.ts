export class Usuario{
  id: string;
  name: string;
  password: string;
  email: string;

  constructor(u: Usuario){
    this.id = u.id;
    this.name = u.name;
    this.password = u.password;
    this.email = u.email
  }
}
