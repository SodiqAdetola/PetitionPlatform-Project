const mongoose = require("mongoose");


const ThresholdSchema = new mongoose.Schema({
    threshold: { type: Number, default: 100},
});

module.exports = mongoose.model('Threshold', ThresholdSchema)