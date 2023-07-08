export class SignUpRequest {
  constructor(
    public pseudo: string,
    public email: string,
    public password: string,
    public sex: string
  ) {}
}
