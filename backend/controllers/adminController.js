const Threshold = require('../models/Threshold')
const Petition = require('../models/Petition');
const { response } = require('express');

exports.getThreshold = async (req, res) => {
  try {
    let threshold = await Threshold.findOne();

    if (!threshold) {
      // If no threshold exists, create a default one
      threshold = new Threshold({ value: 10 }); // You can adjust the default value here
      await threshold.save();
      console.log('Default threshold created.');
    }

    res.status(200).json({ threshold: threshold.value });
  } catch (err) {
    console.error('Error fetching threshold:', err);
    res.status(500).json({ message: 'Failed to fetch threshold' });
  }
}

exports.setThreshold = async (req, res) => {
    try {
        const { value } = req.body;
        
        let threshold = await Threshold.findOne();
        if (!threshold) {
          threshold = new Threshold({ value: value });
        } else {

          threshold.value = value;
        }
    
        await threshold.save();
        res.status(200).json({ message: 'Threshold updated successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update threshold' });
      }

}



exports.createResponse = async (req, res) => {
  try {

    const { id, response } = req.body
  

    const petition = await Petition.findById( id )

    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    if (petition.signitures < petition.threshold) {
      return res.status(400).json({ message: 'Threshold not met yet' });
    }

    petition.response = response;
    petition.status = 'Closed';

    await petition.save();

    res.status(200).json({ message: 'Response submitted and petition closed' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to respond to petition' });
  }
}

