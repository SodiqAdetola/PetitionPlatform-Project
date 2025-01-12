const Petitioner = require('../models/Petitioner');


const validBioIDs = [
    "K1YL8VA2HG", "7DMPYAZAP2", "D05HPPQNJ4", "2WYIM3QCK9", "DHKFIYHMAZ",
    "LZK7P0X0LQ", "H5C98XCENC", "6X6I6TSUFG", "QTLCWUS8NB", "Y4FC3F9ZGS",
    "V30EPKZQI2", "O3WJFGR5WE", "SEIQTS1H16", "X16V7LFHR2", "TLFDFY7RDG",
    "PGPVG5RF42", "FPALKDEL5T", "2BIB99Z54V", "ABQYUQCQS2", "9JSXWO4LGH",
    "QJXQOUPTH9", "GOYWJVDA8A", "6EBQ28A62V", "30MY51J1CJ", "FH6260T08H",
    "JHDCXB62SA", "O0V55ENOT0", "F3ATSRR5DQ", "1K3JTWHA05", "FINNMWJY0G",
    "CET8NUAE09", "VQKBGSE3EA", "E7D6YUPQ6J", "BPX8O0YB5L", "AT66BX2FXM",
    "1PUQV970LA", "CCU1D7QXDT", "TTK74SYYAN", "4HTOAI9YKO", "PD6XPNB80J",
    "BZW5WWDMUY", "340B1EOCMG", "CG1I9SABLL", "49YFTUA96K", "V2JX0IC633",
    "C7IFP4VWIL", "RYU8VSS4N5", "S22A588D75", "88V3GKIVSF", "8OLYIE2FRC"
  ];

exports.createPetitioner = async (req, res) => {
  const { fullName, DoB, bioID, email, } = req.body;

  console.log(email)

  try {

    if (!validBioIDs.includes(bioID)) {
        return res.status(400).json({ message: 'Invalid BioID.' });
      }

      const existingPetitionerByBioID = await Petitioner.findOne({ bioID });
      if (existingPetitionerByBioID) {
          return res.status(400).json({ message: 'This BioID has already been used by another user.' });
      }

      const existingPetitioner = await Petitioner.findOne({ email });
      if (existingPetitioner) {
          return res.status(400).json({ message: 'This email is already associated with an existing user.' });
      }

    const newPetitioner = new Petitioner({
      fullName,
      email, 
      bioID,
      DoB,
    });

    await newPetitioner.save();
    return res.status(201).json({ message: 'Registration successful' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllPetitioners = async (req, res) => {
    try {
      const petitioners = await Petitioner.find({});
      res.status(200).json(petitioners);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.getPetitionerByEmail = async (req, res) => {
    const { email } = req.query;
    console.log('Fetching petitioner with email:', email); 
  
    try {
      const petitioner = await Petitioner.findOne({ email }).populate('signedPetitions');
      if (!petitioner) {
        console.log('No petitioner found for email:', email);
        return res.status(404).json({ message: 'Petitioner not found' });
      }
  
      res.status(200).json(petitioner);
    } catch (err) {
      console.error('Error fetching petitioner:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  