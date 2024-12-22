import { model, Schema } from "mongoose";

interface user {
    name: string,
    email: string,
    mobile: number,
    password: string
}

const userSchema = new Schema<user>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = model('User', userSchema)
export default User