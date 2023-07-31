import { Role } from "./user.role.interface";

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    birth_date: string;
    phone: string;
    address: string;
    role: Role;
}