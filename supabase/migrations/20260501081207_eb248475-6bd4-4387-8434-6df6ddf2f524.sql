CREATE TYPE public.advisor_relationship AS ENUM ('partner', 'preferred_employer', 'personal_contact', 'alumni_network');

CREATE TABLE public.advisor_network (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT,
  relationship public.advisor_relationship NOT NULL DEFAULT 'partner',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, company_name)
);

ALTER TABLE public.advisor_network ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Advisors view own network" ON public.advisor_network FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Advisors insert own network" ON public.advisor_network FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Advisors update own network" ON public.advisor_network FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Advisors delete own network" ON public.advisor_network FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER advisor_network_updated_at BEFORE UPDATE ON public.advisor_network
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX advisor_network_user_idx ON public.advisor_network(user_id);