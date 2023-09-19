import { User } from "src/app/shared/interfaces/user.interface";

export interface UserPetProfileSetting {
    id: number,
    user_fullname_visible: boolean,
    user_location_visible: boolean,
    user_phone_visible: boolean,
    user_email_visible: boolean,
    user: User
}