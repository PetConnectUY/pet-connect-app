import { User } from "./user.interface";

export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_id: number;
    user: User;
}