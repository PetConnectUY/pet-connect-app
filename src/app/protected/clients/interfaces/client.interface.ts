import { ClientBranch } from "./client-branch.interface";

export interface Client {
    id: number,
    name: string,
    central_address: string,
    branches: ClientBranch[]
}