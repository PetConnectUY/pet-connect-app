import { Role } from "./user.role.interface";

export interface User {
    id: number;
    firstname: string | null;
    lastname: string | null;
    email: string | null;
    birth_date: string | null;
    phone: string | null;
    address: string | null;
    role: Role;
}