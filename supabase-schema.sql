CREATE TABLE public.categories (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text
);

CREATE TABLE public.materials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id text REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  image_url text
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica categorias" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Lectura publica materiales" ON public.materials FOR SELECT USING (true);

CREATE POLICY "Insertar categorias admin" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Actualizar categorias admin" ON public.categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Borrar categorias admin" ON public.categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Insertar materiales admin" ON public.materials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Actualizar materiales admin" ON public.materials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Borrar materiales admin" ON public.materials FOR DELETE USING (auth.role() = 'authenticated');

INSERT INTO storage.buckets (id, name, public) VALUES ('catalog-images', 'catalog-images', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Acceso publico imagenes" ON storage.objects FOR SELECT USING (bucket_id = 'catalog-images');
CREATE POLICY "Subida imagenes admin" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'catalog-images' AND auth.role() = 'authenticated');
CREATE POLICY "Edicion imagenes admin" ON storage.objects FOR UPDATE USING (bucket_id = 'catalog-images' AND auth.role() = 'authenticated');
CREATE POLICY "Borrado imagenes admin" ON storage.objects FOR DELETE USING (bucket_id = 'catalog-images' AND auth.role() = 'authenticated');

INSERT INTO public.categories (id, title, description, image_url) VALUES
('cocina', 'Cocinas', 'Acabados y materiales premium para tu cocina.', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'),
('sala', 'Salas', 'Elementos de diseño para espacios de convivencia.', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'),
('oficinas', 'Oficinas', 'Materiales para crear ambientes productivos y elegantes.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'),
('banos', 'Baños', 'Detalles que transforman tu rutina en un spa.', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80'),
('recamaras', 'Recámaras', 'Espacios de descanso con los mejores acabados.', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80'),
('terrazas', 'Terrazas', 'Acabados resistentes y hermosos para exteriores.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
('locales', 'Locales Comerciales', 'Diseño atractivo y duradero para tu negocio.', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80')
ON CONFLICT DO NOTHING;
