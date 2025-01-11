import 'dotenv/config'; // Load variabel lingkungan dari .env
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();
const port = process.env.PORT || 3000;

// Aktifkan CORS
app.use(cors({
    origin: 'https://aidilsaputrakirsan.github.io/SimTA', // Izinkan akses dari GitHub Pages
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Izinkan metode HTTP yang diperlukan
    credentials: true // Izinkan pengiriman cookie atau header otentikasi
  }));

app.use(express.json()); // Untuk parsing JSON body

// GET all items
app.get('/items', async (req, res) => {
  const { data, error } = await supabase.from('items').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST new item
app.post('/items', async (req, res) => {
    console.log('Received POST /items with body:', req.body); // Debugging
    const { name, date_of_birth } = req.body;
  
    // Validasi data
    if (!name || !date_of_birth) {
      return res.status(400).json({ error: 'Name and date_of_birth are required' });
    }
  
    try {
      const { data, error } = await supabase
        .from('items')
        .insert([{ name, date_of_birth }])
        .select(); // Mengembalikan data yang baru dibuat
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
  const { data, error } = await supabase.from('items').delete().match({ id });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});