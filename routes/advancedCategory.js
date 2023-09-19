const router = require("express").Router();
const {
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
} = require("../controller/AdvancedCategoryCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

//category
router.post("/", authMiddleware, isAdmin, createAdvancedCategory);
router.patch("/:id", authMiddleware, isAdmin, updateAdvancedCategoryById);
router.delete("/:id", authMiddleware, isAdmin, deleteAdvancedCategoryById);
router.get("/:id", getAdvancedCategoryById);
router.get("/", getAllAdvancedCategories);

//subcategory
router.post("/sub/:id", authMiddleware, isAdmin, createAdvancedSubcategory);
router.get("/sub/:id", getAllSubcategoriesInCategory);
router.get("/sub/single/:id", getSubcategoryInCategory);
router.patch("/sub/:id", authMiddleware, isAdmin, updateSubcategoryInCategory);
router.delete("/sub/:id", authMiddleware, isAdmin, deleteSubcategoryInCategory);

module.exports = router;
