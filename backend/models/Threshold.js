const mongoose = require("mongoose");


const ThresholdSchema = new mongoose.Schema({
    value: { type: Number},
});

module.exports = mongoose.model('Threshold', ThresholdSchema)