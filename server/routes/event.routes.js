const express = require("express");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerToEvent,
  unregisterFromEvent,
} = require("../controllers/event.controller");

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.post("/:id/register", registerToEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.delete("/:id/unregister", unregisterFromEvent);

module.exports = router;
