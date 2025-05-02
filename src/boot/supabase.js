import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nhrnfhctgxiwkikdydze.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ocm5maGN0Z3hpd2tpa2R5ZHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3OTA0NDEsImV4cCI6MjA2MTM2NjQ0MX0.1i7HlUmR7lM7RLCcqBzaHSWrTsHIeeTSrr1VdB8BzjU' // substitua pela sua key

export const supabase = createClient(supabaseUrl, supabaseKey)
