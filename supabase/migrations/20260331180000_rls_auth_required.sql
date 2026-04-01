-- RLS: exigir auth para escrita, leitura publica apenas LPs ativas

-- bd_cms_lp_v2: publico le apenas status=active, autenticado le tudo, escrita autenticada
DROP POLICY IF EXISTS "Admin full access V2" ON public.bd_cms_lp_v2;
DROP POLICY IF EXISTS "Public read active LPs" ON public.bd_cms_lp_v2;
DROP POLICY IF EXISTS "Public read for active LPs V2" ON public.bd_cms_lp_v2;

CREATE POLICY "Public read active only" ON public.bd_cms_lp_v2
  FOR SELECT USING (status = 'active' OR auth.uid() IS NOT NULL);

CREATE POLICY "Auth write LPs" ON public.bd_cms_lp_v2
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth update LPs" ON public.bd_cms_lp_v2
  FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth delete LPs" ON public.bd_cms_lp_v2
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- bd_cms_history_v2: apenas autenticados
DROP POLICY IF EXISTS "Admin full access history V2" ON public.bd_cms_history_v2;

CREATE POLICY "Auth full access history" ON public.bd_cms_history_v2
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- bd_cms_form_submissions_v2: insert publico (formularios), leitura autenticada
DROP POLICY IF EXISTS "Admin read submissions V2" ON public.bd_cms_form_submissions_v2;

CREATE POLICY "Public insert submissions" ON public.bd_cms_form_submissions_v2
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth read submissions" ON public.bd_cms_form_submissions_v2
  FOR SELECT USING (auth.uid() IS NOT NULL);
