const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'tripAdmin2026';

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('trip_data')
      .select('data')
      .eq('id', 1)
      .single();

    if (error || !data) {
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

    if (error) return res.status(500).json({ error: 'Failed to save data' });
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
