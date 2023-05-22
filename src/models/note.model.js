const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "deleted"],
      default: "active",
    },
    date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const note = new mongoose.model("note", noteSchema);
module.exports = note;
