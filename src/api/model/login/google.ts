export class GoogleLoginForm {
    constructor(token: string, validator: string) {
        this.Validator = validator,
        this.token = token
    }
    token: string
    Validator: string
}