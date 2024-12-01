const mongoose = require("mongoose");

const journeySchema = new mongoose.Schema(
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
    startLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },
    endLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    totalDistance: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journey", journeySchema);
