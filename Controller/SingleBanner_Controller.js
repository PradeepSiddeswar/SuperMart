const SingleBanner = require("../Model/SingleBanner_Model")

exports.create = async (req, res) => {
    const { image,} = req.body;


    if (!req.body) {
        return res.status(400).json({ error: 'Content Cont Be Empty' });
      }
  
    try {
      const singlebanner = new SingleBanner({ image });
      const saved = await singlebanner.save();


    res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

  //Get method

  exports.getAll = async (req, res) => {
    try {
      const records = await SingleBanner.find().select('-__v');
      const responseData = {
        message: 'All images uploaded successfully',
        data: records,
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ error: 'Error fetching records', message: error.message });
    }
  };
  

  // Delete method

exports.delete = (req, res) => {
    const id = req.params.id
    SingleBanner.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(400).send(` homepage images not found with ${id}`)
            } else {
                res.send("homepage images deleted successfully")
            }
        })
        .catch(error => {
            res.status(500).send(error)
        })
  }