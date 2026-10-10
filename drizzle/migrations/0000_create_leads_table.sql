CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type text NOT NULL DEFAULT 'quick_enquiry',
  full_name text NOT NULL,
  contact text,
  email text,
  phone text,
  job_title text,
  organization text,
  country text,
  organization_type text,
  audience_size text,
  message text,
  challenge text,
  requirements text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit enquiries"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);