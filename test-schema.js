import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const env = fs.readFileSync('.env', 'utf8')
const SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1]
const SUPABASE_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1]
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
async function run() {
  const { data, error } = await supabase.from('meetings').select('*').limit(1)
  console.log(data, error)
}
run()
