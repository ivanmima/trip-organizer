require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'tripAdmin2026';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/data', async (req, res) => {
  const { data, error } = await supabase
    .from('trip_data')
    .select('data')
    .eq('id', 1)
    .single();

  if (error || !data) {
    return res.json({ trip: {}, itinerary: [], attractions: [], reservations: [], packing: [] });
  }
  res.json(data.data);
});

app.post('/api/data', async (req, res) => {
  const { password, ...tripData } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const { error } = await supabase
    .from('trip_data')
    .upsert({ id: 1, data: tripData }, { onConflict: 'id' });

  if (error) return res.status(500).json({ error: 'Failed to save data' });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`\n✈️  Trip Organizer running at http://localhost:${PORT}`);
  console.log(`   Admin page: http://localhost:${PORT}/admin.html`);
  console.log(`   Admin password: ${ADMIN_PASSWORD}`);
  console.log(`   Change password: set ADMIN_PASSWORD env variable\n`);
});
