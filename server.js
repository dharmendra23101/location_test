const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas connection
const mongoURI = 'mongodb+srv://ddhruw3337:20045@cluster0.55wtv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Location schema and model
const locationSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now }
});
const Location = mongoose.model('Location', locationSchema);

// API to save location
app.post('/api/location', async (req, res) => {
    const { latitude, longitude } = req.body;
    try {
        const location = new Location({ latitude, longitude });
        await location.save();
        res.status(201).json({ message: 'Location saved successfully', location });
    } catch (error) {
        res.status(500).json({ message: 'Error saving location', error });
    }
});

// API to retrieve the latest saved location
app.get('/api/location', async (req, res) => {
    try {
        const location = await Location.findOne().sort({ timestamp: -1 }); // Get the latest saved location
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving location', error });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));