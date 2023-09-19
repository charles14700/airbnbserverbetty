const router = require("express").Router();

const {
  createWiFiVoucher,
  deleteWiFiVoucher,
  editWiFiVoucher,
  getAllWiFiVouchers,
  getWiFiVoucherById,
  getWiFiVoucherByCriteria,
  deleteManyWiFiVoucher,
  getWiFiVoucherCount,
} = require("../controller/vouchers");

router.post("/", createWiFiVoucher);
router.patch("/:id", editWiFiVoucher);
router.delete("/:id", deleteWiFiVoucher);
router.delete("/", deleteManyWiFiVoucher);
router.get("/", getAllWiFiVouchers);
router.get("/get/count", getWiFiVoucherCount);
router.post("/by-criteria", getWiFiVoucherByCriteria);
router.get("/:id", getWiFiVoucherById);

module.exports = router;
