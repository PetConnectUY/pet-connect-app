import { Role } from "./user.role.interface";

export interface User {
    id: number;
    firstname: string | null;
    lastname: string | null;
    username: string;
    email: string | null;
    birth_date: string;
    phone: string;
    address: string | null;
    role: Role;
}