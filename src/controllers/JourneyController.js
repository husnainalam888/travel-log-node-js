const axios = require("axios");
const Journey = require("../models/Journey");
require("dotenv").config();
const getAddressFromLatLng = async (lat, lng) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const response = await axios.get(url);
  if (response.data.status !== "OK") throw new Error("Failed to fetch address");
  return response.data.results[0].formatted_address;
};

const getDistanceBetweenPoints = async (startLat, startLng, endLat, endLng) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${startLat},${startLng}&destinations=${endLat},${endLng}&key=${apiKey}`;
  const response = await axios.get(url);
  if (
    response.data.status !== "OK" ||
    response.data.rows[0].elements[0].status !== "OK"
  ) {
    throw new Error("Failed to calculate distance");
  }
  return response.data.rows[0].elements[0].distance.text; // Distance in human-readable format (e.g., "5.3 km")
};

const startJourney = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const { id: userId } = req.user;

    const existingJourney = await Journey.findOne({
      userId,
      isComplete: false,
    });
    if (existingJourney) {
      return res.status(400).json({
        message:
          "You already have an active journey. End it before starting a new one.",
      });
    }

    const address = await getAddressFromLatLng(lat, lng);

    const now = new Date();
    const title = `On ${now.toDateString()} at ${
      now.toTimeString().split(" ")[0]
    }`;

    const journey = new Journey({
      userId,
      title,
      startLocation: { lat, lng, address },
    });

    await journey.save();

    res.status(201).json({
      message: "Journey started successfully",
      data: journey,
      status: true,
    });
  } catch (error) {
    console.error("Error starting journey:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const endJourney = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const { id: userId } = req.user;

    const journey = await Journey.findOne({ userId, isComplete: false });
    if (!journey) {
      return res
        .status(404)
        .json({ message: "No active journey found. Start a journey first." });
    }

    const address = await getAddressFromLatLng(lat, lng);

    // Calculate distance using Google API
    const distance = await getDistanceBetweenPoints(
      journey.startLocation.lat,
      journey.startLocation.lng,
      lat,
      lng
    );

    journey.endLocation = { lat, lng, address };
    journey.isComplete = true;
    journey.totalDistance = distance; // Store distance in the journey model

    await journey.save();

    res.status(200).json({
      message: "Journey ended successfully",
      status: true,
      data: journey,
    });
  } catch (error) {
    console.error("Error ending journey:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const { id: userId } = req.user;
    console.log("/getLocation : body ", req.body);
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }
    const address = await getAddressFromLatLng(lat, lng);
    const recentJourney = await Journey.findOne(
      {
        userId,
        isComplete: false,
      },
      { sort: { createdAt: -1 } }
    );
    res.status(200).json({
      status: true,
      data: { address, recentJourney: recentJourney || false },
    });
  } catch (error) {
    console.error("Error getting location:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const allJourneys = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const journeys = await Journey.find({ userId });
    console.log("journeys : ", journeys);
    res.status(200).json({
      status: true,
      data: journeys.reverse() || [],
    });
  } catch (error) {
    console.error("Error getting location:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = { startJourney, endJourney, getLocation, allJourneys };
