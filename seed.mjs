import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mqksshhyocjtxbuwsehc.supabase.co';
const supabaseKey = 'sb_publishable_cypz4qkey3e5JX0R71j06A_vdx-2UHQ';

const supabase = createClient(supabaseUrl, supabaseKey);

const RESPONSABLES = [
  'SALVADOR PALMERO',
  'JESÚS LOPEZ',
  'JUAN GONZÁLEZ',
  'JOSÉ BELLIDO',
];

const PERSONAL = [
  'RAFAEL PALLARÉS',
  'FAUSTINO GONZÁLEZ',
  'FRANCISCO RODRÍGUEZ',
  'JUAN MANUEL PÉREZ',
  'LORETO CARRETERO',
  'ALEJANDRO ÁVILA',
  'ALBERTO AUGUSTO',
];

async function seed() {
  console.log('Insertando responsables...');
  for (const nombre of RESPONSABLES) {
    await supabase.from('responsables').insert([{ nombre }]);
  }
  
  console.log('Insertando personal...');
  for (const nombre of PERSONAL) {
    await supabase.from('personal').insert([{ nombre }]);
  }
  
  console.log('¡Listo!');
}

seed().catch(console.error);
