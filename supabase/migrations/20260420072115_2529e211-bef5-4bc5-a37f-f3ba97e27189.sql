-- Request logs (AI observability)
CREATE TABLE public.request_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id UUID,
  model TEXT NOT NULL,
  status_code INT NOT NULL,
  latency_ms INT,
  prompt_tokens INT,
  completion_tokens INT,
  total_tokens INT,
  error TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_request_logs_created_at ON public.request_logs (created_at DESC);
CREATE INDEX idx_request_logs_user_id ON public.request_logs (user_id);
CREATE INDEX idx_request_logs_status ON public.request_logs (status_code);

ALTER TABLE public.request_logs ENABLE ROW LEVEL SECURITY;

-- No public access; only service_role (used by admin edge function) can read.
CREATE POLICY "No public read on request_logs"
  ON public.request_logs FOR SELECT
  USING (false);

-- Message feedback (data flywheel)
CREATE TABLE public.message_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message_id UUID NOT NULL,
  session_id UUID NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating IN (-1, 1)),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, message_id)
);

CREATE INDEX idx_message_feedback_created_at ON public.message_feedback (created_at DESC);

ALTER TABLE public.message_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own feedback"
  ON public.message_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own feedback"
  ON public.message_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own feedback"
  ON public.message_feedback FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own feedback"
  ON public.message_feedback FOR DELETE
  USING (auth.uid() = user_id);