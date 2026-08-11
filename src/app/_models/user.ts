import { Role } from "./role";
import { EmailValidator } from "@angular/forms";

export class User {
    _id: number;    
    name: string;
    email: EmailValidator;
    mobile: Number;
    address: string;
    dob:Date;
    gender: string;
    weight:number;
    height:number;
    password: string;
    role: Role;
    token: string;
    created: Date;
    updated: Date;
}