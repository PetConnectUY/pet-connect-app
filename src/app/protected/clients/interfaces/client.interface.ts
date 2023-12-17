import { ClientBranch } from "./client-branch.interface";

export interface Client {
    id: number,
    name: string,
    central_address: string,
    url: string,
    branches: ClientBranch[]
}