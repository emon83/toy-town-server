import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config/config.js";
import { UserStatus } from "./user.constant.js";

//* Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    photoURL: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: UserStatus,
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//* pre save middleware / hooks
userSchema.pre("save", async function (next) {
  const user = this; //this refers to document
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

userSchema.pre("save", async function (next) {
  const isUserExist = await User.findOne({
    email: this.email,
  });

  if (isUserExist) {
    throw new Error(
      "This user is already exist, changes email if you create new user"
    );
  }

  next();
});

userSchema.statics.isUserExistsById = async function (id) {
  return await User.findById(id);
};

userSchema.statics.isUserExistsByEmail = async function (email) {
  return await User.findOne({ email });
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

//* Export the model
export const User = model("User", userSchema);
