const mongoose = require("mongoose"); // Erase if already required
const crypto = require("crypto");

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    idNumber: {
      type: Number,
    },
    nextOfKin: {
      type: String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    passwordHash: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    address: {
      phoneNumber: {
        type: String,
        default: "",
      },
      message: {
        type: String,
        default: "",
      },
      firstName: {
        type: String,
        default: "",
      },
      secondName: {
        type: String,
        default: "",
      },
      County: {
        type: String,
        default: "",
      },
    },

    cart: {
      type: Array,
      default: [],
    },
    dateJoined: {
      type: Date,
      default: Date.now,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10min
  return resetToken;
};

//Export the model
module.exports = mongoose.model("User", userSchema);
