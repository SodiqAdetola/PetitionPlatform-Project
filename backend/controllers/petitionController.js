const Petition = require('../models/Petition');
const Petitioner = require('../models/Petitioner');

exports.createPetition = async (req, res) => {
  const { petitionText, petitionTitle, petitioner } = req.body;

  try {
    const newPetition = new Petition({
      petitionTitle,
      petitionText,
      petitioner,
    });

    await newPetition.save();
    return res.status(201).json({ message: 'Petition successfully created' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllPetitions = async (req, res) => {
    try {
      const petitions = await Petition.find({});
      res.status(200).json(petitions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Could not fetch petitions' });
    }
  };

exports.signPetition = async (req, res) => {
    const { email } = req.body;
    const { id: petitionId } = req.params;

    try {
        const user = await Petitioner.findOne({ email });
        
        if (user.signedPetitions.includes(petitionId)) {
          return res.status(400).json({ message: 'You have already signed this petition.' });
        }
    
        const petition = await Petition.findByIdAndUpdate(
          petitionId,
          { $inc: { signitures: 1 } },
          { new: true }
        );
        
        user.signedPetitions.push(petitionId);
        await user.save();
    
        return res.status(200).json({ message: 'Petition signed successfully!' });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }
    
}