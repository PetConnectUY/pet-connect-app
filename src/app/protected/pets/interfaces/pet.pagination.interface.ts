import { Pagination } from "src/app/protected/shared/modules/pagination/interfaces/pagination";
import { Pet } from "./pet.interface";

export interface PetPagination extends Pagination {
    data: Pet[];
}