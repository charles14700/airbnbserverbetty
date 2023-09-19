const AdvancedCategory = require("../models/advancedCategory");
const AdvancedSubcategory = require("../models/advancedSubCategory");

// Create a new advanced category
const createAdvancedCategory = async (req, res) => {
  try {
    const advancedCategory = new AdvancedCategory(req.body);
    await advancedCategory.save();
    res.status(201).json({ advancedCategory: advancedCategory, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all advanced categories
const getAllAdvancedCategories = async (req, res) => {
  try {
    const advancedCategories = await AdvancedCategory.find();
    res.json({ advancedCategories: advancedCategories, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an advanced category by ID
const getAdvancedCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const advancedCategory = await AdvancedCategory.findById(categoryId);
    if (!advancedCategory) {
      return res.status(404).json({ message: "Advanced category not found" });
    }
    res.json(advancedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an advanced category by collection name
// const getAdvancedCategoryByCollection = async (req, res) => {
//   const { collectionName } = req.body;
//   try {
//     const advancedCategory = await AdvancedCategory.find({
//       name: collectionName,
//     });
//     if (!advancedCategory) {
//       return res.status(404).json({ message: "no categories found" });
//     }
//     res.json({ advancedCategory: advancedCategory, success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Update an advanced category by ID
const updateAdvancedCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const updatedCategory = await AdvancedCategory.findByIdAndUpdate(
      categoryId,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Advanced category not found" });
    }
    res.json({ updatedCategory: updatedCategory, message: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an advanced category by ID
const deleteAdvancedCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const deletedCategory = await AdvancedCategory.findByIdAndRemove(
      categoryId
    );
    if (!deletedCategory) {
      return res.status(404).json({ message: "Advanced category not found" });
    }
    res.json({ message: "Advanced category deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//subcategory Arena

// Create a new advanced subcategory within a category
const createAdvancedSubcategory = async (req, res) => {
  const categoryId = req.params.id;
  console.log(categoryId);
  try {
    const advancedCategory = await AdvancedCategory.findById(categoryId);

    if (!advancedCategory) {
      return res.status(404).json({ message: "Advanced category not found" });
    }

    const newSubcategory = new AdvancedSubcategory({
      ...req.body,
      category: categoryId,
    });
    await newSubcategory.save();

    res.status(201).json({ newSubcategory: newSubcategory, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all subcategories within a category
const getAllSubcategoriesInCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const advancedCategory = await AdvancedSubcategory.find({
      category: categoryId,
    }).populate("category");

    if (!advancedCategory) {
      return res.status(404).json({ message: "Advanced category not found" });
    }
    res.json({ advancedCategory: advancedCategory, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific subcategory within a category
const getSubcategoryInCategory = async (req, res) => {
  try {
    const advancedSubcategory = await AdvancedSubcategory.findById(
      req.params.id
    );
    if (!advancedSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json({ advancedSubcategory: advancedSubcategory, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a specific subcategory within a category
const updateSubcategoryInCategory = async (req, res) => {
  const subcategoryId = req.params.id;
  try {
    const advancedSubcategory = await AdvancedSubcategory.findByIdAndUpdate(
      subcategoryId,
      req.body,
      { new: true }
    );
    if (!advancedSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json({ advancedSubcategory: advancedSubcategory, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a specific subcategory within a category
const deleteSubcategoryInCategory = async (req, res) => {
  const subcategoryId = req.params.id;
  try {
    const deletedSubcategory = await AdvancedSubcategory.findByIdAndDelete(
      subcategoryId
    );
    if (!deletedSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json({ message: "Subcategory deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAdvancedCategory,
  getAllAdvancedCategories,
  getAdvancedCategoryById,
  updateAdvancedCategoryById,
  deleteAdvancedCategoryById,
  createAdvancedSubcategory,
  getAllSubcategoriesInCategory,
  getSubcategoryInCategory,
  updateSubcategoryInCategory,
  deleteSubcategoryInCategory,
};
