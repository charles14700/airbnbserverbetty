const router = require("express").Router();
const {
  calendarEvent,
  redirect,
  scheduleEvent,
  getCalendarEvents,
} = require("../controller/googleCtl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", calendarEvent);
router.get("/redirect", redirect);
router.post("/schedule-event", scheduleEvent);
router.get("/get/events", getCalendarEvents);

module.exports = router;
