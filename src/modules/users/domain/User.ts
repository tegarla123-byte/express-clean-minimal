export class User {
    public id: number | null;
    public name: string;
    public email: string;

    constructor(id: number | null, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
