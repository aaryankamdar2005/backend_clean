import mongoose from "mongoose"; // ✅ Use `import` instead of `require`

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const User = mongoose.model("User", userSchema);

export default User;
