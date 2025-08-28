// src/controllers/AIDescriptor.js

require("dotenv").config();
const fetch = require('node-fetch');

// The Gemini API endpoint and model
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

async function main(productName) {
  try {
    if (!productName || typeof productName !== 'string') {
      console.error("Invalid input: productName must be a non-empty string.");
      return null;
    }

    const apiKey = process.env.GEMINI_KEY;
    if (!apiKey) {
      console.error("API Key not found. Please set GEMINI_KEY in your .env file.");
      return null;
    }

    // console.log(`Generating description for: "${productName}"`);

    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate a brief and engaging product description for ${productName}. The description should be no more than 3-4 sentences long and focus on the key features and benefits.`
              }
            ]
          }
        ]
      }),
    });

    const data = await response.json();

    // Check for API errors in the response
    if (data.error) {
      console.error("API error:", data.error.message);
      return null;
    }

    // Extract the text
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No description generated";

    // console.log("AI Description:", text);
    return text;

  } catch (err) {
    console.error("AI generation error:", err);
    return null;
  }
}

module.exports = main;