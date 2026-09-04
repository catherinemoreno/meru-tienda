-- =============================================================================
-- Meru — DATOS DE DEMOSTRACIÓN (seed)
-- =============================================================================
-- ADVERTENCIA: este archivo inserta las mismas categorías y productos de
-- ejemplo que hoy ves en la tienda con datos mock (src/lib/data/*.ts).
-- Son datos de DEMOSTRACIÓN — bórralos o reemplázalos por tu catálogo real
-- antes de lanzar la tienda a producción real. Puedes borrarlos luego con:
--
--   delete from public.products;
--   delete from public.categories;
--
-- Cómo usar: Supabase Dashboard > SQL Editor > pega este archivo > Run.
-- Debes correr primero supabase/schema.sql.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Categorías (7 categorías raíz, con sus subcategorías)
-- -----------------------------------------------------------------------------
insert into public.categories (slug, name, description, tagline, image_url, subcategories, sort_order)
values
  ('hogar', 'Hogar', 'Todo para hacer tu casa más cómoda y funcional.', null,
   'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
   array['Habitación','Baño','Cocina','Sala','Organización','Lavandería','Almacenamiento','Accesorios para el hogar','Productos para mascotas'],
   1),
  ('herramientas', 'Herramientas', 'Herramientas y accesorios para cada proyecto.', null,
   'https://images.unsplash.com/photo-1581147036324-c1c4c17ff165?w=800&q=80',
   array['Herramientas manuales','Herramientas eléctricas','Accesorios para herramientas','Ferretería','Jardinería','Automotriz','Organización de herramientas','Accesorios para reparación','Productos para bricolaje/DIY'],
   2),
  ('moda', 'Moda', 'Ropa, calzado y accesorios para tu estilo.', null,
   'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
   array['Ropa de hombre','Zapatos de hombre','Accesorios de hombre','Ropa de mujer','Zapatos de mujer','Accesorios de mujer','Bolsos','Carteras','Gorras','Accesorios','Moda casual'],
   3),
  ('decoracion', 'Decoración', 'Detalles que transforman cualquier espacio.', null,
   'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
   array['Decoración de sala','Decoración de habitación','Decoración de cocina','Decoración de baño','Iluminación','Cuadros y paredes','Textiles','Organizadores decorativos','Decoración de escritorio','Decoración exterior'],
   4),
  ('bienestar', 'Bienestar', 'Cuidado personal, relajación y vida activa.', null,
   'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
   array['Cuidado personal','Belleza','Relajación','Masaje','Fitness','Accesorios deportivos','Descanso','Cuidado corporal','Accesorios para ejercicio'],
   5),
  ('tecnologia', 'Tecnología', 'Gadgets y accesorios para el día a día.', null,
   'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=800&q=80',
   array['Audio','Audífonos','Accesorios para celular','Cargadores','Smart Home','Computación','Accesorios tecnológicos','Gadgets','Iluminación tecnológica','Gaming'],
   6),
  ('hallazgos', 'Hallazgos', 'Los productos más virales y curiosos del momento.', 'Cosas que no sabías que necesitabas',
   'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80',
   array['Productos virales','Gadgets curiosos','Inventos ingeniosos','Soluciones para el día a día','Novedades','Productos sorprendentes','Tendencias','Imperdibles'],
   7)
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- Productos de demostración (20)
-- -----------------------------------------------------------------------------
insert into public.products
  (id, slug, name, short_description, description, category_slug, subcategory, price, compare_at_price, sku, images, is_new, is_bestseller, is_offer, variants, rating, reviews_count, stock, active, features)
values
  ('p1', 'organizador-modular-cocina', 'Organizador modular de cocina',
   'Aprovecha cada centímetro de tu alacena.',
   'Set de organizadores apilables para alacena y nevera, fabricados en plástico resistente libre de BPA. Ideal para ordenar despensa, especias y recipientes.',
   'hogar', 'Cocina', 79900, 119900, 'HOG-001',
   '["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80","https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80"]'::jsonb,
   false, true, true, null, 4.7, 128, 34, true, array['Apilable','Libre de BPA','Fácil de lavar']),

  ('p2', 'set-organizadores-closet', 'Set de organizadores para closet',
   'Divide y ordena tu ropa doblada.',
   'Set de 8 divisores de tela reforzada para closet, perfectos para camisetas, ropa interior y accesorios.',
   'hogar', 'Organización', 59900, null, 'HOG-002',
   '["https://images.unsplash.com/photo-1558211583-d26f610c1eb1?w=800&q=80","https://picsum.photos/seed/closet-organizer/800/800"]'::jsonb,
   true, false, false, null, 4.5, 41, 50, true, null),

  ('p3', 'dispensador-jabon-automatico', 'Dispensador de jabón automático',
   'Higiene sin tocar el dispensador.',
   'Dispensador de jabón con sensor infrarrojo, recargable por USB, ideal para baño y cocina.',
   'hogar', 'Baño', 64900, 89900, 'HOG-003',
   '["https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80","https://picsum.photos/seed/soap-dispenser/800/800"]'::jsonb,
   false, false, true, null, 4.3, 22, 18, true, null),

  ('p4', 'kit-destornilladores-precision', 'Kit de destornilladores de precisión',
   '45 piezas para reparaciones y electrónica.',
   'Kit profesional de destornilladores de precisión con maletín, ideal para celulares, computadores y electrodomésticos.',
   'herramientas', 'Herramientas manuales', 49900, null, 'HER-001',
   '["https://images.unsplash.com/photo-1581147036324-c1c4c17ff165?w=800&q=80","https://picsum.photos/seed/screwdriver-kit/800/800"]'::jsonb,
   false, true, false, null, 4.8, 96, 60, true, null),

  ('p5', 'taladro-inalambrico-21v', 'Taladro inalámbrico 21V',
   'Potencia y autonomía para tus proyectos.',
   'Taladro atornillador inalámbrico de 21V con batería de litio, incluye maletín y set de puntas.',
   'herramientas', 'Herramientas eléctricas', 189900, 249900, 'HER-002',
   '["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80","https://picsum.photos/seed/drill-21v/800/800"]'::jsonb,
   false, true, true, null, 4.6, 74, 15, true, null),

  ('p6', 'organizador-herramientas-rodante', 'Organizador de herramientas rodante',
   'Lleva tus herramientas a donde las necesites.',
   'Carrito organizador con múltiples compartimentos y ruedas resistentes para talleres y garajes.',
   'herramientas', 'Organización de herramientas', 139900, null, 'HER-003',
   '["https://picsum.photos/seed/tool-cart/800/800","https://picsum.photos/seed/tool-cart-2/800/800"]'::jsonb,
   true, false, false, null, null, null, 12, true, null),

  ('p7', 'chaqueta-bomber-hombre', 'Chaqueta bomber hombre',
   'Estilo urbano para cualquier ocasión.',
   'Chaqueta bomber unisex en tela resistente al viento, con forro interior y bolsillos funcionales.',
   'moda', 'Ropa de hombre', 129900, 179900, 'MOD-001',
   '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80","https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80"]'::jsonb,
   false, false, true, '[{"type":"talla","options":["S","M","L","XL"]}]'::jsonb, 4.4, 33, 28, true, null),

  ('p8', 'bolso-tote-mujer', 'Bolso tote de mujer',
   'Espacioso, versátil y elegante.',
   'Bolso tote en cuero sintético con compartimento interno para portátil, ideal para el día a día.',
   'moda', 'Bolsos', 99900, null, 'MOD-002',
   '["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"]'::jsonb,
   true, true, false, '[{"type":"color","options":["Negro","Camel","Beige"]}]'::jsonb, 4.9, 58, 40, true, null),

  ('p9', 'gorra-clasica-unisex', 'Gorra clásica unisex',
   'Básico infaltable en todo outfit.',
   'Gorra ajustable de algodón con visera curva, disponible en varios colores.',
   'moda', 'Gorras', 39900, null, 'MOD-003',
   '["https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80","https://picsum.photos/seed/cap-classic/800/800"]'::jsonb,
   false, false, false, '[{"type":"color","options":["Negro","Blanco","Azul"]}]'::jsonb, null, null, 70, true, null),

  ('p10', 'lampara-led-escritorio', 'Lámpara LED de escritorio',
   'Luz cálida y fría regulable.',
   'Lámpara LED táctil con tres tonos de luz e intensidad regulable, puerto USB integrado.',
   'decoracion', 'Iluminación', 69900, 99900, 'DEC-001',
   '["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80","https://picsum.photos/seed/led-lamp/800/800"]'::jsonb,
   false, true, true, null, 4.6, 87, 45, true, null),

  ('p11', 'set-cuadros-decorativos', 'Set de cuadros decorativos',
   '3 piezas para renovar tus paredes.',
   'Set de 3 cuadros con diseño minimalista, marco en madera clara, listos para colgar.',
   'decoracion', 'Cuadros y paredes', 89900, null, 'DEC-002',
   '["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80","https://picsum.photos/seed/wall-art/800/800"]'::jsonb,
   true, false, false, null, null, null, 25, true, null),

  ('p12', 'guirnalda-luces-decorativas', 'Guirnalda de luces decorativas',
   'Ambienta cualquier rincón de tu casa.',
   'Guirnalda de 10 metros con luces LED cálidas, resistente a la intemperie, ideal para interior y exterior.',
   'decoracion', 'Decoración exterior', 44900, 64900, 'DEC-003',
   '["https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&q=80","https://picsum.photos/seed/fairy-lights/800/800"]'::jsonb,
   false, false, true, null, 4.5, 19, 55, true, null),

  ('p13', 'pistola-masaje-percusion', 'Pistola de masaje por percusión',
   'Recuperación muscular en casa.',
   'Masajeador de percusión inalámbrico con 6 cabezales intercambiables y varios niveles de intensidad.',
   'bienestar', 'Masaje', 149900, 219900, 'BIE-001',
   '["https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?w=800&q=80","https://picsum.photos/seed/massage-gun/800/800"]'::jsonb,
   false, true, true, null, 4.7, 112, 20, true, null),

  ('p14', 'set-bandas-elasticas-fitness', 'Set de bandas elásticas fitness',
   'Entrena en casa sin excusas.',
   'Set de 5 bandas de resistencia con distintos niveles, incluye bolso de transporte.',
   'bienestar', 'Fitness', 34900, null, 'BIE-002',
   '["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80","https://picsum.photos/seed/resistance-bands/800/800"]'::jsonb,
   true, false, false, null, null, null, 65, true, null),

  ('p15', 'difusor-aromaterapia-humidificador', 'Difusor de aromaterapia y humidificador',
   'Relájate con luz y aroma.',
   'Difusor ultrasónico con luz LED de colores, ideal para aromaterapia y para humectar ambientes.',
   'bienestar', 'Relajación', 59900, null, 'BIE-003',
   '["https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&q=80","https://picsum.photos/seed/diffuser/800/800"]'::jsonb,
   false, true, false, null, 4.8, 64, 30, true, null),

  ('p16', 'audifonos-inalambricos-bt', 'Audífonos inalámbricos Bluetooth',
   'Sonido nítido, batería todo el día.',
   'Audífonos in-ear con estuche de carga, resistentes al sudor y cancelación de ruido pasiva.',
   'tecnologia', 'Audífonos', 89900, 139900, 'TEC-001',
   '["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80","https://picsum.photos/seed/earbuds/800/800"]'::jsonb,
   false, true, true, '[{"type":"color","options":["Negro","Blanco"]}]'::jsonb, 4.6, 203, 80, true, null),

  ('p17', 'bombillo-inteligente-wifi', 'Bombillo inteligente WiFi',
   'Controla la luz desde tu celular.',
   'Bombillo LED inteligente compatible con Alexa y Google Home, 16 millones de colores.',
   'tecnologia', 'Smart Home', 44900, null, 'TEC-002',
   '["https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80","https://picsum.photos/seed/smart-bulb/800/800"]'::jsonb,
   true, false, false, null, null, null, 90, true, null),

  ('p18', 'soporte-celular-magnetico-carro', 'Soporte magnético de celular para carro',
   'Manos libres y carga segura.',
   'Soporte magnético para rejilla de aire, compatible con la mayoría de celulares modernos.',
   'tecnologia', 'Accesorios para celular', 29900, 44900, 'TEC-003',
   '["https://picsum.photos/seed/car-mount/800/800","https://picsum.photos/seed/car-mount-2/800/800"]'::jsonb,
   false, false, true, null, null, null, 100, true, null),

  ('p19', 'mini-proyector-luces-estrellas', 'Mini proyector de luces y estrellas',
   'El hallazgo viral favorito para tu cuarto.',
   'Proyector LED de galaxia con control remoto, ideal para crear ambientes relajantes y contenido para redes.',
   'hallazgos', 'Productos virales', 54900, 79900, 'HAL-001',
   '["https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80","https://picsum.photos/seed/galaxy-projector/800/800"]'::jsonb,
   false, true, true, null, 4.9, 341, 22, true, null),

  ('p20', 'cortador-vegetales-multifuncional', 'Cortador multifuncional de vegetales',
   'El gadget de cocina que arrasa en TikTok.',
   'Cortador 12 en 1 con distintas cuchillas para picar, rallar y cortar vegetales en segundos.',
   'hallazgos', 'Soluciones para el día a día', 39900, null, 'HAL-002',
   '["https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=800&q=80","https://picsum.photos/seed/veggie-cutter/800/800"]'::jsonb,
   true, true, false, null, 4.5, 156, 48, true, null)
on conflict (id) do nothing;
