const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let emails = [];

// Add email endpoint
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (emails.includes(email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    emails.push(email);
    res.status(200).json({ message: 'Email added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Optional: Get emails endpoint (for testing)
app.get('/api/waitlist', (req, res) => {
  res.json({ emails });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
