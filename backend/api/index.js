import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import serverless from 'serverless-http'; // Import serverless-http

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();

const allowedOrigins = [
  'https://aidilsaputrakirsan.github.io',
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

// Define your routes as usual
app.get('/items', async (req, res) => {
  try {
    const { data, error } = await supabase.from('items').select('*');
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    console.log('Data from Supabase:', data);
    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST new item
app.post('/items', async (req, res) => {
  const { name, date_of_birth } = req.body;

  // Validasi data
  if (!name || !date_of_birth) {
    return res.status(400).json({ error: 'Name and date_of_birth are required' });
  }

  try {
    const { data, error } = await supabase
      .from('items')
      .insert([{ name, date_of_birth }])
      .select();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT update item
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, date_of_birth } = req.body;
  const { data, error } = await supabase
    .from('items')
    .update({ name, date_of_birth })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE item
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('items').delete().eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export const handler = serverless(app); // Export handler for Vercel

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});