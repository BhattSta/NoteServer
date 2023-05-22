const express = require("express");
const router = express.Router();
const { noteController } = require("../controller");
const { noteValidation } = require("../validations");
const { checkToken } = require("../middleware/tokenAuth");
const note = require("../models/note.model");

router.post(
  "/createTask",
  checkToken,
  noteValidation.taskValidation,
  noteController.createNote
);

router.get("/getNotes", checkToken, noteController.getNotes);

router.get("/getNote/:id", checkToken, noteController.getNote);

router.patch("/updateNote/:id", checkToken, noteController.editNote);

router.delete("/deleteNote/:id", checkToken, noteController.deleteNote);

module.exports = router;
