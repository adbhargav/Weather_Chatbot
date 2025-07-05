const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const nlp = require('compromise');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENWEATHER_API_KEY;

app.post('/api/chat', async (req, res) => {
  const message = req.body.message;
  const doc = nlp(message);
  const city = doc.match('#Place').text(); // Extract city/place

  if (!city) {
    return res.json({ response: "I couldn't identify a city in your message." });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;

    const description = data.weather[0].description;
    const temp = data.main.temp;

    res.json({
      response: `The weather in ${city} is ${description} with a temperature of ${temp}°C.`,
    });
  } catch (error) {
    res.json({ response: "Sorry, I couldn't get the weather data. Make sure the city is correct." });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
