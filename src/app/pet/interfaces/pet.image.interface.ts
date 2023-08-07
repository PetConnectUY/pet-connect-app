import { Pet } from "./pet.interface";

export interface PetImage {
    id: number;
    name: string;
    is_cover_image: boolean;
    pet: Pet;
}