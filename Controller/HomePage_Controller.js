// const Profile = require('../Model/Profile_Model');
// const PostedPic = require('../Model/PostedPic_Model');

// exports.create = async (req, res) => {
//   try {
//     // Handle image and video uploads here
//     // You can access the image path with req.files.image[0].path
//     // You can access the video path with req.files.video[0].path

//     // Example of saving image and video paths to the database
//     const imageFilePath = req.files.image[0].path;
//     const videoFilePath = req.files.video[0].path;

//     // Create a new profile with the image file path
//     const newProfile = new Profile({
//       profilePic: imageFilePath,
//     });

//     // Save the profile to the database
//     await newProfile.save();

//     // Create a new posted pic with the image and video file paths, name, and timings
//     const newPostedPic = new PostedPic({
//       profilePic: imageFilePath, // Assuming you want the same image for both profilePic and postedPic
//       video: videoFilePath,
//       name: req.body.name, // Add the name from the request body
//       timings: req.body.timings, // Add the timings from the request body
//       // You can add other fields here if needed
//     });

//     // Save the posted pic to the database
//     await newPostedPic.save();

//      // Respond with a success message or any necessary data
//      const responseData = {
//       profile: newProfile,
//       postedpic: newPostedPic,
//     };

//     res.json(responseData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

