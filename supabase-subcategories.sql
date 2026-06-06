CREATE TABLE public.subcategories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id text REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text
);

ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica subcategorias" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Insertar subcategorias" ON public.subcategories FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualizar subcategorias" ON public.subcategories FOR UPDATE USING (true);
CREATE POLICY "Borrar subcategorias" ON public.subcategories FOR DELETE USING (true);

ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS subcategory_id uuid REFERENCES public.subcategories(id) ON DELETE CASCADE;
