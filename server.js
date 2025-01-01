const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to emails storage
const emailsPath = path.join(__dirname, 'data', 'emails.json');

// Initialize emails.json if it doesn't exist
async function initializeEmailsFile() {
  try {
    await fs.access(emailsPath);
  } catch {
    await fs.writeFile(emailsPath, JSON.stringify([]));
  }
}

// In-memory emails array for production
let emailsInMemory = [];

// Add email endpoint
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Use in-memory storage in production, file storage locally
    if (process.env.NODE_ENV === 'production') {
      if (emailsInMemory.includes(email)) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      emailsInMemory.push(email);
    } else {
      const emails = JSON.parse(await fs.readFile(emailsPath, 'utf8'));
      if (emails.includes(email)) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      emails.push(email);
      await fs.writeFile(emailsPath, JSON.stringify(emails, null, 2));
    }
    
    res.status(200).json({ message: 'Email added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
initializeEmailsFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
