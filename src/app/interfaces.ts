export interface User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    group: number [];
    creationDate: Date;
}

export interface Group {
    id: number;
    name: string;
    creationDate: Date;
}