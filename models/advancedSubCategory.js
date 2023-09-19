const mongoose = require("mongoose");

const advancedSubcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    items: [
      {
        title: {
          type: String,
          required: true,
        },
        image: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdvancedCategory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdvancedSubcategory = mongoose.model(
  "AdvancedSubcategory",
  advancedSubcategorySchema
);

module.exports = AdvancedSubcategory;
