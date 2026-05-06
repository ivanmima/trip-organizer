const { createClient } = require('@supabase/supabase-js');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'tripAdmin2026';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables');
  }
  return createClient(url, key);
}

module.exports = async function handler(req, res) {
  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    console.error('Supabase init failed:', err.message);
    return res.status(500).json({ error: err.message });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('trip_data')
      .select('data')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Supabase GET error:', error.message);
      return res.json({ trip: {}, itinerary: [], attractions: [], reservations: [], packing: [] });
    }
    return res.json(data.data);
  }

  if (req.method === 'POST') {
    const { password, ...tripData } = req.body;
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const { error } = await supabase
      .from('trip_data')
      .upsert({ id: 1, data: tripData }, { onConflict: 'id' });

    if (error) {
      console.error('Supabase POST error:', error.message);
      return res.status(500).json({ error: 'Failed to save: ' + error.message });
    }
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
