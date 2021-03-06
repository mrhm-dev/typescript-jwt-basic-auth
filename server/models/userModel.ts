import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

import { IUser } from './../interfaces/index';

const userSchema = new Schema({
	name: {
		type: String,
		required: [true, "Please tell us your name!"],
	},
	email: {
		type: String,
		required: [true, "Please provide your email"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "Please provide a valid email"],
	},
	password: {
		type: String,
		required: [true, "Please provide a password"],
		minlength: 8,
		select: false,
	},
});

userSchema.pre<IUser>("save", async function (next) {
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};


const User = model("User", userSchema);

export default User;
