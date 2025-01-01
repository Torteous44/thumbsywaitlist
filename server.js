const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase setup
const supabaseUrl = 'https://riioktcrfupvthazrdkz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpaW9rdGNyZnVwdnRoYXpyZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTU2NjAsImV4cCI6MjA1MTMzMTY2MH0.wxtZz3fhT9Kg2nEnP-6bUmDm2y7660_bgdWLprPKS2s';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Add email endpoint
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Insert email into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email }])
      .select();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(400).json({ error: 'Email already registered' });
      }
      throw error;
    }

    res.status(200).json({ message: 'Email added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get emails endpoint
app.get('/api/waitlist', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('email, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ emails: data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
