const mongoose = require("mongoose");

const AdvancedCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const AdvancedCategory = mongoose.model(
  "AdvancedCategory",
  AdvancedCategorySchema
);

module.exports = AdvancedCategory;
