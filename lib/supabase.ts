// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bpxvonpgtsvgjhzrlxjc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweHZvbnBndHN2Z2poenJseGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTYxNDksImV4cCI6MjA2NTI3MjE0OX0.MwaKknR5hcbs3T6g_DL-iu-9jKS0c-Ta6NLWt7LG71k'
export const supabase = createClient(supabaseUrl, supabaseKey)
