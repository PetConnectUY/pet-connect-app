import { User } from "src/app/shared/interfaces/user.interface";

export interface Pet {
    id: number;
    name: string;
    birth_date: Date | null;
    race: string | null;
    gender: string;
    pet_information: string;
    user: User;
}