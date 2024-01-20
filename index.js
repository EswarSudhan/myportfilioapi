const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const app = express();

app.use(cors(
    { origin:["https://eswarsudhan.vercel.app/"],
    methods:["GET","POST"],
    credentials:true}
));
app.use(express.static('uploads'));

const PORT = process.env.PORT || 5001;

mongoose.connect("mongodb+srv://skeswarsudhan:GT4XZSuCnzqh7s0c@cluster0.mtpcjlu.mongodb.net/mydata?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB Connection successful")).catch((err) => {
    console.log(err);
});

// Create a mongoose model for the image
const Image = mongoose.model('Image', {
    filename: String,
    path: String,
});

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',  // Define your upload directory
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// API endpoint for uploading an image
app.post('/api/upload', upload.single('image'), async (req, res) => {
    const { originalname, path } = req.file;

    // Save the image details to MongoDB
    const image = new Image({
        filename: originalname,
        path: `/${originalname}`,  // Relative path to 'uploads' directory
    });

    await image.save();

    res.send('Image uploaded successfully!');
});

// API endpoint for retrieving all images
app.get('/api/images', async (req, res) => {
    const images = await Image.find();
    res.json(images);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
