import { User } from "src/app/shared/interfaces/user.interface";
import { PetImage } from "./pet.image.interface";
import { PetToken } from "./pet.token.interface";
import { PetRace } from "./pet.race.interface";

export interface Pet {
    id: number;
    name: string;
    type: string;
    birth_date: Date | null;
    race: PetRace;
    gender: string;
    pet_information: string;
    images: PetImage[];
    user: User;
    pet_token: PetToken;
}