// index.js
import 'dotenv/config'; // Load variabel lingkungan dari .env
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

// Buat instance Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const app = express();
const port = process.env.PORT || 3000;

// Daftar origin yang diizinkan
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://aidilsaputrakirsan.github.io',
  // Tambahkan domain lain yang Anda gunakan, contoh:
  //'https://simta-backend-irdmswmzw-aidilsaputrakirsans-projects.vercel.app',
  //'https://your-frontend-domain.vercel.app',
];

// Konfigurasi CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Izinkan request tanpa origin (misalnya Postman/cURL)
      if (!origin) return callback(null, true);

      // Cek apakah origin sudah terdaftar
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Production: sebaiknya tolak origin yang tidak dikenal
        // callback(new Error('Not allowed by CORS'));
        
        // Debugging: kita izinkan semua, agar tidak repot
        callback(null, true);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Middleware untuk parsing JSON body
app.use(express.json());

// GET all items
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

  // Validasi input
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

  try {
    const { data, error } = await supabase
      .from('items')
      .update({ name, date_of_birth })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating item:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE item
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('items')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error deleting item:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Jalankan server di lokal
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
  });
}

// Vercel butuh export default app
export default app;