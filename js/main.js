/**
 * ====================================================================
 * ATR Brostería - Chancay
 * Proyecto: Taller de Programación Web (Sección 21583 - Grupo 4)
 * Script principal: main.js
 * 
 * Módulos implementados:
 * 1. Estado del local en tiempo real (Horarios comerciales)
 * 2. Navegación móvil accesible (Menú hamburguesa + ARIA)
 * 3. Catálogo centralizado de productos y gestión de disponibilidad (LocalStorage)
 * 4. Renderizado dinámico de la carta digital, filtros por categoría y modal
 * 5. Personalizador de combos con cálculo de precio reactivo (actualizarPrecio)
 * 6. Sistema de promociones semanales y promoción destacada del día
 * 7. Galería interactiva con visor Lightbox accesible y navegación por teclado
 * 8. Formulario de contacto con validación robusta y almacenamiento local
 * 9. Cotizador interactivo de pedidos según cantidad de personas
 * 10. Acordeón interactivo de Preguntas Frecuentes (FAQ)
 * ====================================================================
 */

'use strict';

/* ====================================================================
   1. DATOS GLOBALES DEL NEGOCIO Y CATÁLOGO
   ==================================================================== */

// Horarios de atención:
// Lunes a Viernes: 12:00 a 22:00
// Sábados y Domingos: 12:00 a 23:00
const HORARIOS_NEGOCIO = {
  semana: { apertura: 12, cierre: 22, textoCierre: '10:00 pm' },
  finDeSemana: { apertura: 12, cierre: 23, textoCierre: '11:00 pm' },
  textoApertura: '12:00 pm'
};

// Catálogo maestro de productos (RF-P1, RF-P2, RF-P3, RF-P5)
const PRODUCTOS_BASE = [
  {
    id: 'prod-01',
    nombre: '1/4 Pollo Broaster',
    categoria: 'pollos',
    precio: 12.00,
    precioAntes: null,
    tiempo: '15 min',
    personas: '1 persona',
    descripcion: 'Una presa de pollo broaster crujiente y jugosa, sazonada con nuestra receta exclusiva. Incluye papas fritas personales y cremas artesanales.',
    imagen: 'img/pollo-cuarto.jpg',
    destacado: true,
    sello: true,
    alergenos: 'Contiene gluten. Cremas pueden contener huevo y mostaza.',
    procesoCoccion: 'Cocción a presión a 175 °C para un crocante exterior uniforme y máxima retención de jugos.'
  },
  {
    id: 'prod-02',
    nombre: '1/2 Pollo Broaster',
    categoria: 'pollos',
    precio: 22.00,
    precioAntes: null,
    tiempo: '18 min',
    personas: '2 a 3 personas',
    descripcion: 'Dos presas generosas de pollo broaster con receta secreta. Servidas con porción generosa de papas fritas y selección de dos cremas caseras.',
    imagen: 'img/pollo-medio.jpg',
    destacado: false,
    sello: true,
    alergenos: 'Contiene gluten.',
    procesoCoccion: 'Marinado por 4 horas con especias chancayanas y fritura controlada por temperatura.'
  },
  {
    id: 'prod-03',
    nombre: 'Pollo Entero Broaster',
    categoria: 'pollos',
    precio: 42.00,
    precioAntes: null,
    tiempo: '25 min',
    personas: '4 a 6 personas',
    descripcion: 'Cuatro presas completas doradas y crujientes. Acompañado de papas familiares crocantes, ensalada fresca y el set completo de cremas ATR.',
    imagen: 'img/pollo-entero.jpg',
    destacado: true,
    sello: true,
    alergenos: 'Contiene gluten.',
    procesoCoccion: 'Freidora industrial a presión para una cocción interior tierna y piel crocante.'
  },
  {
    id: 'prod-04',
    nombre: 'Combo Personal ATR',
    categoria: 'combos',
    precio: 16.00,
    precioAntes: 19.00,
    tiempo: '15 min',
    personas: '1 persona',
    descripcion: '1/4 de pollo broaster + papas fritas personales + ensalada clásica + 1 vaso de chicha morada artesanal helada.',
    imagen: 'img/combo-personal.jpg',
    destacado: true,
    sello: true,
    alergenos: 'Contiene gluten.',
    procesoCoccion: 'Preparado al instante con nuestro empaque térmico para mantener el crocante.'
  },
  {
    id: 'prod-05',
    nombre: 'Combo Pareja',
    categoria: 'combos',
    precio: 32.00,
    precioAntes: 38.00,
    tiempo: '20 min',
    personas: '2 personas',
    descripcion: '1/2 pollo broaster (2 presas grandes) + papas fritas familiares + ensalada + 2 vasos de chicha o gaseosas personales.',
    imagen: 'img/combo-pareja.jpg',
    destacado: true,
    sello: true,
    alergenos: 'Contiene gluten.',
    procesoCoccion: 'Cocción simultánea a presión para servir recién salido del aceite.'
  },
  {
    id: 'prod-06',
    nombre: 'Combo Familiar ATR',
    categoria: 'combos',
    precio: 59.00,
    precioAntes: 70.00,
    tiempo: '25 min',
    personas: '4 a 6 personas',
    descripcion: '1 pollo entero broaster (4 presas grandes) + porción familiar gigante de papas + ensalada fresca + gaseosa de 1.5 L o jarra de chicha + 4 cremas.',
    imagen: 'img/combo-familiar.jpg',
    destacado: true,
    sello: true,
    alergenos: 'Contiene gluten.',
    procesoCoccion: 'El favorito de las familias en Chancay con ahorro garantizado.'
  },
  {
    id: 'prod-07',
    nombre: 'Combo Fiesta ATR',
    categoria: 'combos',
    precio: 78.00,
    precioAntes: 92.00,
    tiempo: '30 min',
    personas: '6 a 8 personas',
    descripcion: '1 pollo y medio broaster (6 presas) + 2 porciones familiares de papas crocantes + ensalada grande + 2 gaseosas de 1.5 L + set doble de cremas.',
    imagen: 'img/combo-fiesta.jpg',
    destacado: false,
    sello: true,
    alergenos: 'Contiene gluten.',
    procesoCoccion: 'Especial para reuniones familiares y celebraciones en el hogar.'
  },
  {
    id: 'prod-08',
    nombre: 'Papas Fritas Personales',
    categoria: 'guarniciones',
    precio: 7.00,
    precioAntes: null,
    tiempo: '10 min',
    personas: '1 persona',
    descripcion: 'Papas nativas seleccionadas cortadas en bastón, fritas a doble temperatura para lograr exterior crocante e interior cremoso.',
    imagen: 'img/papas-personales.jpg',
    destacado: false,
    sello: false,
    alergenos: 'Sin gluten en la papa; freidora compartida.',
    procesoCoccion: 'Doble fritura a 160 °C y 185 °C.'
  },
  {
    id: 'prod-09',
    nombre: 'Papas Fritas Familiares',
    categoria: 'guarniciones',
    precio: 14.00,
    precioAntes: null,
    tiempo: '12 min',
    personas: '3 a 4 personas',
    descripcion: 'Porción grande de papas fritas crujientes con un toque de sal marina, ideales para compartir.',
    imagen: 'img/papas-familiares.jpg',
    destacado: false,
    sello: false,
    alergenos: 'Sin gluten en la papa; freidora compartida.',
    procesoCoccion: 'Doble fritura artesanal.'
  },
  {
    id: 'prod-10',
    nombre: 'Ensalada Fresca Clásica',
    categoria: 'guarniciones',
    precio: 6.00,
    precioAntes: null,
    tiempo: '5 min',
    personas: '2 personas',
    descripcion: 'Lechuga orgánica crocante, tomate en rodajas, pepinillo fresco y vinagreta clásica de la casa con limón de la campiña de Huaral.',
    imagen: 'img/ensalada.jpg',
    destacado: false,
    sello: false,
    alergenos: 'Apta para vegetarianos y libre de gluten.',
    procesoCoccion: 'Preparada al momento con vegetales lavados y desinfectados.'
  },
  {
    id: 'prod-11',
    nombre: 'Surtido de Cremas ATR',
    categoria: 'guarniciones',
    precio: 4.00,
    precioAntes: null,
    tiempo: '3 min',
    personas: '2 a 3 personas',
    descripcion: 'Porciones adicionales de nuestras cremas caseras: ají parrillero especial, mayonesa artesanal, tártara con finas hierbas y ketchup.',
    imagen: 'img/cremas.jpg',
    destacado: false,
    sello: true,
    alergenos: 'Contiene huevo, mostaza y picante (ají).',
    procesoCoccion: 'Receta secreta batida al día sin conservantes artificiales.'
  },
  {
    id: 'prod-12',
    nombre: 'Chicha Morada Artesanal (1 L)',
    categoria: 'bebidas',
    precio: 8.00,
    precioAntes: null,
    tiempo: '3 min',
    personas: '3 a 4 personas',
    descripcion: 'Hervida con maíz morado, piña madura, manzana, canela y clavo de olor, con su toque exacto de limón recién exprimido.',
    imagen: 'img/chicha.jpg',
    destacado: false,
    sello: false,
    alergenos: 'Sin alérgenos comunes.',
    procesoCoccion: 'Cocción tradicional lenta por 2 horas para extraer todo el color y aroma.'
  },
  {
    id: 'prod-13',
    nombre: 'Gaseosa 1.5 L (Inca Kola / Coca Cola)',
    categoria: 'bebidas',
    precio: 9.00,
    precioAntes: null,
    tiempo: '2 min',
    personas: '4 personas',
    descripcion: 'Bebida gasificada helada para acompañar tu pollo broaster. Presentación de 1.5 litros en botella retornable o descartable.',
    imagen: 'img/bebidas.jpg',
    destacado: false,
    sello: false,
    alergenos: 'Sin alérgenos comunes.',
    procesoCoccion: 'Servida bien helada de refrigerador comercial.'
  }
];

// Promociones por cada día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
const PROMOCIONES = [
  {
    diaIndice: 0,
    diaNombre: 'Domingo',
    titulo: 'Domingo de Banquete Familiar',
    descripcion: 'Pollo entero broaster + papas familiares + 1 litro de chicha morada artesanal + todas las cremas.',
    precioNuevo: 48.00,
    precioViejo: 56.00,
    horario: 'Válido todo el domingo de 12:00 pm a 11:00 pm',
    imagen: 'img/combo-familiar.jpg',
    whatsappMsg: 'Hola ATR Brostería, deseo pedir la promoción del Domingo de Banquete Familiar a S/ 48.00'
  },
  {
    diaIndice: 1,
    diaNombre: 'Lunes',
    titulo: 'Lunes Broastero',
    descripcion: '1/4 de Pollo Broaster + papas fritas crocantes + gaseosa personal o chicha de regalo.',
    precioNuevo: 13.00,
    precioViejo: 16.00,
    horario: 'Válido lunes de 12:00 pm a 10:00 pm',
    imagen: 'img/pollo-cuarto.jpg',
    whatsappMsg: 'Hola ATR Brostería, deseo pedir la promoción del Lunes Broastero a S/ 13.00'
  },
  {
    diaIndice: 2,
    diaNombre: 'Martes',
    titulo: 'Martes 2x1 en Cuartos',
    descripcion: 'Lleva 2 porciones de 1/4 de pollo broaster con sus respectivas papas y cremas.',
    precioNuevo: 20.00,
    precioViejo: 24.00,
    horario: 'Válido martes de 12:00 pm a 10:00 pm',
    imagen: 'img/pollo-cuarto.jpg',
    whatsappMsg: 'Hola ATR Brostería, deseo pedir la promoción de Martes 2x1 en Cuartos a S/ 20.00'
  },
  {
    diaIndice: 3,
    diaNombre: 'Miércoles',
    titulo: 'Miércoles Familiar',
    descripcion: 'Combo Familiar completo (pollo entero + papas + ensalada + gaseosa 1.5 L) con descuento especial.',
    precioNuevo: 52.00,
    precioViejo: 59.00,
    horario: 'Válido miércoles de 12:00 pm a 10:00 pm',
    imagen: 'img/combo-familiar.jpg',
    whatsappMsg: 'Hola ATR Brostería, deseo pedir la promoción de Miércoles Familiar a S/ 52.00'
  },
  {
    diaIndice: 4,
    diaNombre: 'Jueves',
    titulo: 'Jueves Broaster Fest',
    descripcion: '1/2 pollo broaster + papas familiares + 2 vasos de chicha morada artesanal helada.',
    precioNuevo: 25.00,
    precioViejo: 30.00,
    horario: 'Válido jueves de 12:00 pm a 10:00 pm',
    imagen: 'img/pollo-medio.jpg',
    whatsappMsg: 'Hola ATR Brostería, deseo pedir la promoción de Jueves Broaster Fest a S/ 25.00'
  },
  {
    diaIndice: 5,
    diaNombre: 'Viernes',
    titulo: 'Viernes en Pareja',
    descripcion: 'Combo Pareja (1/2 pollo + papas + ensalada + 2 bebidas) + porción de cremas gratis.',
    precioNuevo: 29.00,
    precioViejo: 35.00,
    horario: 'Válido viernes de 12:00 pm a 10:00 pm',
    imagen: 'img/combo-pareja.jpg',
    whatsappMsg: 'Hola ATR Brostería, deseo pedir la promoción de Viernes en Pareja a S/ 29.00'
  },
  {
    diaIndice: 6,
    diaNombre: 'Sábado',
    titulo: 'Sábado Fiesta ATR',
    descripcion: 'Combo Fiesta gigante (1 1/2 pollo + 2 papas familiares + 2 gaseosas 1.5 L) al mejor precio.',
    precioNuevo: 69.00,
    precioViejo: 78.00,
    horario: 'Válido sábado de 12:00 pm a 11:00 pm',
    imagen: 'img/combo-fiesta.jpg',
    whatsappMsg: 'Hola ATR Brostería, deseo pedir la promoción de Sábado Fiesta ATR a S/ 69.00'
  }
];

// Testimonios de clientes reales para index.html
const TESTIMONIOS = [
  {
    nombre: 'Carlos Mendoza',
    distrito: 'Chancay Centro',
    comentario: 'El mejor pollo broaster de todo Chancay. El crocante por fuera y lo jugoso por dentro no tienen comparación con ninguna otra pollería. ¡Las cremas son 10/10!',
    estrellas: 5
  },
  {
    nombre: 'María Elena Salazar',
    distrito: 'Urb. Las Viñas, Chancay',
    comentario: 'Pedimos siempre el Combo Familiar para las cenas del fin de semana. Llega calientito y el delivery es súper rápido y amable. 100% recomendado.',
    estrellas: 5
  },
  {
    nombre: 'Jorge Luis Morales',
    distrito: 'Huaral / Visitante',
    comentario: 'Cada vez que visito Chancay con mi familia es parada obligatoria en ATR Brostería. Precios justos, porciones bien servidas y sabor casero.',
    estrellas: 5
  }
];

// Galería de fotos para galeria.html
const FOTOS_GALERIA = [
  {
    src: 'img/local.jpg',
    caption: 'Fachada y ambiente de nuestro local en el corazón de Chancay',
    destacada: true
  },
  {
    src: 'img/pollo-entero.jpg',
    caption: 'Pollo Broaster entero crujiente, recién salido de freidora a presión',
    destacada: false
  },
  {
    src: 'img/marinado.jpg',
    caption: 'Proceso de marinado artesanal de 4 horas con especias naturales',
    destacada: false
  },
  {
    src: 'img/cocina.jpg',
    caption: 'Nuestra área de cocina con freidoras industriales a temperatura controlada',
    destacada: false
  },
  {
    src: 'img/combo-familiar.jpg',
    caption: 'Combo Familiar servido con abundantes papas fritas y ensalada',
    destacada: false
  },
  {
    src: 'img/papas-familiares.jpg',
    caption: 'Papas fritas artesanales cortadas a mano y fritas a doble temperatura',
    destacada: false
  },
  {
    src: 'img/cremas.jpg',
    caption: 'Variedad de cremas artesanales: ají casero, tártara y mayonesa',
    destacada: false
  },
  {
    src: 'img/delivery.jpg',
    caption: 'Equipo de reparto listo para llevar tu pedido caliente hasta tu puerta',
    destacada: false
  }
];

/* ====================================================================
   2. GESTIÓN DE LOCALSTORAGE (DISPONIBILIDAD Y MENSAJES)
   ==================================================================== */

const STORAGE_KEYS = {
  disponibilidad: 'atr_disponibilidad_productos',
  mensajes: 'atr_mensajes_contacto',
  tiempos: 'atr_tiempos_preparacion'
};

/**
 * Obtiene el mapa de disponibilidad de productos { id: boolean }
 */
function obtenerMapaDisponibilidad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.disponibilidad);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error al leer disponibilidad desde localStorage:', e);
    return {};
  }
}

/**
 * Guarda el mapa de disponibilidad en localStorage
 */
function guardarMapaDisponibilidad(mapa) {
  try {
    localStorage.setItem(STORAGE_KEYS.disponibilidad, JSON.stringify(mapa));
  } catch (e) {
    console.error('Error al guardar disponibilidad:', e);
  }
}

/**
 * Alterna la disponibilidad de un producto (RF-P1-02)
 * @param {string} idProducto 
 * @returns {boolean} nuevo estado de disponibilidad
 */
function toggleDisponibilidad(idProducto) {
  const mapa = obtenerMapaDisponibilidad();
  const estadoActual = mapa[idProducto] !== undefined ? mapa[idProducto] : true;
  mapa[idProducto] = !estadoActual;
  guardarMapaDisponibilidad(mapa);
  return mapa[idProducto];
}

/**
 * Determina si un producto está disponible
 * @param {string} idProducto 
 */
function estaDisponible(idProducto) {
  const mapa = obtenerMapaDisponibilidad();
  return mapa[idProducto] !== undefined ? mapa[idProducto] : true;
}

/**
 * Obtiene la lista de productos enriquecida con la disponibilidad actual
 */
function obtenerProductos() {
  const mapa = obtenerMapaDisponibilidad();
  return PRODUCTOS_BASE.map(prod => ({
    ...prod,
    disponible: mapa[prod.id] !== undefined ? mapa[prod.id] : true
  }));
}

/**
 * Guarda un mensaje en el buzón de contacto (RF-P1-04, RF-P1-06)
 */
function guardarMensajeContacto(datosMensaje) {
  try {
    const lista = JSON.parse(localStorage.getItem(STORAGE_KEYS.mensajes) || '[]');
    lista.unshift({
      id: 'msg-' + Date.now(),
      fecha: new Date().toLocaleString('es-PE'),
      leido: false,
      ...datosMensaje
    });
    localStorage.setItem(STORAGE_KEYS.mensajes, JSON.stringify(lista));
  } catch (e) {
    console.error('Error al guardar mensaje en localStorage:', e);
  }
}

/* ====================================================================
   3. MÓDULO: NAVEGACIÓN Y ESTADO DEL LOCAL
   ==================================================================== */

/**
 * Inicializa el menú responsive para dispositivos móviles
 */
function inicializarMenuMovil() {
  const btnHamburguesa = document.getElementById('btn-hamburguesa');
  const mainNav = document.getElementById('main-nav');

  if (!btnHamburguesa || !mainNav) return;

  btnHamburguesa.addEventListener('click', () => {
    const expandido = btnHamburguesa.getAttribute('aria-expanded') === 'true';
    btnHamburguesa.setAttribute('aria-expanded', !expandido);
    btnHamburguesa.classList.toggle('activo');
    mainNav.classList.toggle('abierto');
  });

  // Cerrar menú al hacer clic en un enlace
  mainNav.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', () => {
      btnHamburguesa.setAttribute('aria-expanded', 'false');
      btnHamburguesa.classList.remove('activo');
      mainNav.classList.remove('abierto');
    });
  });
}

/**
 * Calcula y actualiza el estado comercial del local (Abierto / Cerrado)
 */
function actualizarEstadoLocal() {
  const elementosBadge = document.querySelectorAll('[data-estado-local]');
  if (elementosBadge.length === 0) return;

  const ahora = new Date();
  const diaSemana = ahora.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  const horaActual = ahora.getHours() + ahora.getMinutes() / 60;

  const esFinDeSemana = (diaSemana === 0 || diaSemana === 6);
  const regla = esFinDeSemana ? HORARIOS_NEGOCIO.finDeSemana : HORARIOS_NEGOCIO.semana;

  const abierto = horaActual >= regla.apertura && horaActual < regla.cierre;

  elementosBadge.forEach(badge => {
    badge.classList.remove('estado-abierto', 'estado-cerrado');
    if (abierto) {
      badge.classList.add('estado-abierto');
      badge.innerHTML = `<i class="fa-solid fa-circle" style="font-size: 0.65em; margin-right: 0.35rem; color: #FFFFFF;"></i> Abierto ahora · Cierra ${regla.textoCierre}`;
    } else {
      badge.classList.add('estado-cerrado');
      badge.innerHTML = `<i class="fa-solid fa-circle" style="font-size: 0.65em; margin-right: 0.35rem; color: #FFFFFF;"></i> Cerrado ahora · Abre ${HORARIOS_NEGOCIO.textoApertura}`;
    }
  });
}

/**
 * Actualiza el año actual en el pie de página
 */
function actualizarAnioFooter() {
  const spanAnio = document.getElementById('anio-actual');
  if (spanAnio) {
    spanAnio.textContent = new Date().getFullYear();
  }
}

/* ====================================================================
   4. MÓDULO: PÁGINA DE INICIO (index.html)
   ==================================================================== */

function inicializarPaginaInicio() {
  const contenedorPromo = document.getElementById('promo-del-dia');
  const contenedorDestacados = document.getElementById('grid-destacados');
  const contenedorTestimonios = document.getElementById('grid-testimonios');

  if (!contenedorPromo && !contenedorDestacados && !contenedorTestimonios) return;

  // Renderizar promoción de hoy
  if (contenedorPromo) {
    const diaHoy = new Date().getDay();
    const promoHoy = PROMOCIONES.find(p => p.diaIndice === diaHoy) || PROMOCIONES[1];

    contenedorPromo.innerHTML = `
      <article class="tarjeta-promo-dia">
        <img src="${promoHoy.imagen}" alt="${promoHoy.titulo}" loading="lazy">
        <div class="promo-dia-cuerpo">
          <span class="etiqueta-dia"><i class="fa-solid fa-calendar-day"></i> Oferta especial de hoy (${promoHoy.diaNombre})</span>
          <h3>${promoHoy.titulo}</h3>
          <div class="promo-precios">
            <span class="precio-nuevo">S/ ${promoHoy.precioNuevo.toFixed(2)}</span>
            <span class="precio-viejo">S/ ${promoHoy.precioViejo.toFixed(2)}</span>
          </div>
          <p class="desc">${promoHoy.descripcion}</p>
          <p class="horario"><i class="fa-solid fa-clock"></i> ${promoHoy.horario}</p>
          <div style="margin-top: 0.8rem; display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <a href="https://wa.me/51987654321?text=${encodeURIComponent(promoHoy.whatsappMsg)}" class="btn btn-acento" target="_blank" rel="noopener">
              <i class="fa-brands fa-whatsapp"></i> Pedir por WhatsApp
            </a>
            <a href="promociones.html" class="btn btn-borde">Ver promociones de toda la semana</a>
          </div>
        </div>
      </article>
    `;
  }

  // Renderizar productos favoritos / destacados
  if (contenedorDestacados) {
    const productos = obtenerProductos().filter(p => p.destacado).slice(0, 3);
    contenedorDestacados.innerHTML = productos.map(prod => `
      <article class="tarjeta tarjeta-producto ${!prod.disponible ? 'producto-agotado' : ''}">
        <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
        ${!prod.disponible ? '<span class="sello-agotado">AGOTADO</span>' : ''}
        <div class="tarjeta-cuerpo">
          ${prod.sello ? '<span class="badge" style="background-color: var(--color-acento); color:#fff; font-size:0.75rem; margin-bottom:0.4rem; display:inline-block;"><i class="fa-solid fa-fire"></i> Receta exclusiva ATR</span>' : ''}
          <h3>${prod.nombre}</h3>
          <p>${prod.descripcion}</p>
          <div style="margin-top: 0.6rem; font-size: 0.85rem; color: var(--color-gris);">
            <span><i class="fa-solid fa-clock" style="color:var(--color-acento)"></i> ${prod.tiempo}</span> · 
            <span><i class="fa-solid fa-user-group" style="color:var(--color-acento)"></i> ${prod.personas}</span>
          </div>
        </div>
        <div class="tarjeta-pie">
          <div>
            ${prod.precioAntes ? `<span class="precio-antes">S/ ${prod.precioAntes.toFixed(2)}</span>` : ''}
            <span class="precio">S/ ${prod.precio.toFixed(2)}</span>
          </div>
          <a href="carta.html" class="btn-ver-detalle">
            <i class="fa-solid fa-eye"></i> Ver en carta
          </a>
        </div>
      </article>
    `).join('');
  }

  // Renderizar testimonios
  if (contenedorTestimonios) {
    contenedorTestimonios.innerHTML = TESTIMONIOS.map(t => `
      <article class="tarjeta tarjeta-testimonio">
        <div class="estrellas">
          ${Array(t.estrellas).fill('<i class="fa-solid fa-star"></i>').join('')}
        </div>
        <blockquote>"${t.comentario}"</blockquote>
        <div class="autor">
          <i class="fa-solid fa-user" aria-hidden="true"></i>
          <div>
            <strong>${t.nombre}</strong>
            <span>${t.distrito}</span>
          </div>
        </div>
      </article>
    `).join('');
  }
}

/* ====================================================================
   5. MÓDULO: CARTA DIGITAL Y MODAL (carta.html)
   ==================================================================== */

function inicializarCartaDigital() {
  const contenedorFiltros = document.getElementById('filtros-categoria');
  const contenedorCarta = document.getElementById('grid-carta');
  const mensajeVacio = document.getElementById('mensaje-vacio');
  const modal = document.getElementById('modal-producto');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');
  const modalCuerpo = document.getElementById('modal-cuerpo');

  if (!contenedorCarta) return;

  const categorias = [
    { id: 'todos', label: 'Todos' },
    { id: 'pollos', label: 'Pollos Broaster' },
    { id: 'combos', label: 'Combos Familiares' },
    { id: 'guarniciones', label: 'Guarniciones' },
    { id: 'bebidas', label: 'Bebidas' }
  ];

  let categoriaActiva = 'todos';

  // Renderizar botones de filtro
  function renderizarFiltros() {
    if (!contenedorFiltros) return;
    const productos = obtenerProductos();

    contenedorFiltros.innerHTML = categorias.map(cat => {
      const cantidad = cat.id === 'todos' 
        ? productos.length 
        : productos.filter(p => p.categoria === cat.id).length;

      return `
        <button type="button" class="btn-filtro ${cat.id === categoriaActiva ? 'activo' : ''}" data-cat="${cat.id}">
          <span>${cat.label}</span>
          <span class="contador">${cantidad}</span>
        </button>
      `;
    }).join('');

    // Eventos de filtro
    contenedorFiltros.querySelectorAll('.btn-filtro').forEach(btn => {
      btn.addEventListener('click', () => {
        categoriaActiva = btn.getAttribute('data-cat');
        renderizarFiltros();
        renderizarProductosCarta();
      });
    });
  }

  // Renderizar tarjetas de productos en la carta
  function renderizarProductosCarta() {
    const productos = obtenerProductos();
    const filtrados = categoriaActiva === 'todos'
      ? productos
      : productos.filter(p => p.categoria === categoriaActiva);

    if (filtrados.length === 0) {
      contenedorCarta.innerHTML = '';
      if (mensajeVacio) mensajeVacio.classList.remove('oculto');
      return;
    }

    if (mensajeVacio) mensajeVacio.classList.add('oculto');

    contenedorCarta.innerHTML = filtrados.map(prod => `
      <article class="tarjeta tarjeta-producto ${!prod.disponible ? 'producto-agotado' : ''}" id="tarjeta-${prod.id}">
        <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
        ${!prod.disponible ? '<span class="sello-agotado">AGOTADO</span>' : ''}
        <div class="tarjeta-cuerpo">
          ${prod.sello ? '<span class="badge" style="background-color: var(--color-acento); color:#fff; font-size:0.75rem; margin-bottom:0.4rem; display:inline-block;"><i class="fa-solid fa-award"></i> Receta exclusiva ATR</span>' : ''}
          <h3>${prod.nombre}</h3>
          <p>${prod.descripcion}</p>
          <div style="margin-top: 0.6rem; font-size: 0.85rem; color: var(--color-gris);">
            <span><i class="fa-solid fa-clock" style="color:var(--color-acento)"></i> ${prod.tiempo}</span> · 
            <span><i class="fa-solid fa-users" style="color:var(--color-acento)"></i> ${prod.personas}</span>
          </div>
        </div>
        <div class="tarjeta-pie">
          <div>
            ${prod.precioAntes ? `<span class="precio-antes">S/ ${prod.precioAntes.toFixed(2)}</span>` : ''}
            <span class="precio">S/ ${prod.precio.toFixed(2)}</span>
          </div>
          <button type="button" class="btn-ver-detalle" data-detalle-id="${prod.id}">
            <i class="fa-solid fa-eye"></i> Ver detalle
          </button>
        </div>
      </article>
    `).join('');

    // Listener para los botones "Ver detalle"
    contenedorCarta.querySelectorAll('[data-detalle-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-detalle-id');
        abrirModalProducto(id);
      });
    });
  }

  // Abre y rellena el modal de detalle del producto (RF-P1-03, RF-P2-06, RF-P3-04, RF-P5-02, RF-P5-03)
  function abrirModalProducto(idProducto) {
    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === idProducto);
    if (!prod || !modal || !modalCuerpo) return;

    const modalTitulo = document.getElementById('modal-titulo');
    if (modalTitulo) modalTitulo.textContent = prod.nombre;

    let totalCalculado = prod.precio;

    // Generar opciones de personalización si es combo o pollo
    const esPersonalizable = prod.categoria === 'combos' || prod.categoria === 'pollos';
    const extrasHtml = esPersonalizable ? `
      <fieldset class="personalizacion">
        <legend><i class="fa-solid fa-sliders"></i> Personaliza tu pedido (opcional):</legend>
        <label class="opcion-extra">
          <input type="checkbox" class="chk-extra" data-precio="4.50" data-nombre="Extra porción de papas fritas">
          <span>Extra papas fritas doradas (+ S/ 4.50)</span>
          <span class="extra-precio">+ S/ 4.50</span>
        </label>
        <label class="opcion-extra">
          <input type="checkbox" class="chk-extra" data-precio="1.50" data-nombre="Extra crema de ají casero ATR">
          <span>Extra crema de ají casero (+ S/ 1.50)</span>
          <span class="extra-precio">+ S/ 1.50</span>
        </label>
        <label class="opcion-extra">
          <input type="checkbox" class="chk-extra" data-precio="2.00" data-nombre="Porción extra de ensalada clásica">
          <span>Porción extra de ensalada (+ S/ 2.00)</span>
          <span class="extra-precio">+ S/ 2.00</span>
        </label>
        <label class="opcion-extra">
          <input type="checkbox" class="chk-extra" data-precio="0.00" data-nombre="Sin picante / ají aparte">
          <span>Sin picante (cremas aparte sin costo)</span>
          <span class="extra-precio">+ S/ 0.00</span>
        </label>
      </fieldset>
    ` : '';

    modalCuerpo.innerHTML = `
      <div>
        <img src="${prod.imagen}" alt="${prod.nombre}" style="width: 100%; max-height: 260px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
        
        <div class="detalle-categoria">
          <span class="badge" style="background-color: var(--color-primario); color:#fff; text-transform: uppercase;">
            ${prod.categoria}
          </span>
          ${prod.disponible 
            ? '<span class="badge estado-disponible" style="background-color: #E8F5E9; color: var(--color-exito); margin-left: 0.5rem;"><i class="fa-solid fa-check"></i> Disponible hoy</span>' 
            : '<span class="badge estado-agotado" style="background-color: #FFEBEE; color: var(--color-error); margin-left: 0.5rem;"><i class="fa-solid fa-triangle-exclamation"></i> Temporalmente agotado</span>'}
        </div>

        <p class="detalle-descripcion">${prod.descripcion}</p>

        <div class="detalle-datos">
          <span class="dato"><i class="fa-solid fa-clock"></i> <strong>Tiempo:</strong> ${prod.tiempo}</span>
          <span class="dato"><i class="fa-solid fa-users"></i> <strong>Porciones:</strong> ${prod.personas}</span>
          <span class="dato"><i class="fa-solid fa-fire"></i> <strong>Cocción:</strong> Freidora a presión</span>
        </div>

        <!-- Información sobre proceso de cocción y alérgenos (RF-P2-06, RF-P3-04) -->
        <div style="background-color: var(--color-crema); padding: 0.8rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.88rem;">
          <p style="margin-bottom: 0.4rem;"><strong><i class="fa-solid fa-circle-info" style="color:var(--color-acento)"></i> Proceso ATR:</strong> ${prod.procesoCoccion}</p>
          <p style="color: var(--color-gris); margin: 0;"><strong><i class="fa-solid fa-shield-halved" style="color:var(--color-acento)"></i> Alérgenos:</strong> ${prod.alergenos}</p>
        </div>

        ${extrasHtml}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-top:1px solid var(--color-borde); padding-top:0.8rem;">
          <span style="font-size: 1.05rem; font-weight: 600;">Total a pagar:</span>
          <span id="modal-precio-total" class="detalle-precio" style="margin: 0;">S/ ${totalCalculado.toFixed(2)}</span>
        </div>

        <div class="detalle-acciones">
          ${prod.disponible ? `
            <a id="btn-pedir-whatsapp-modal" href="#" class="btn btn-acento" target="_blank" rel="noopener">
              <i class="fa-brands fa-whatsapp"></i> Pedir por WhatsApp
            </a>
          ` : `
            <button type="button" class="btn" style="background-color: var(--color-gris); color:#fff; cursor: not-allowed;" disabled>
              <i class="fa-solid fa-ban"></i> Producto agotado por hoy
            </button>
          `}
          <button type="button" class="btn btn-borde" id="btn-modal-cerrar-secundario">Cerrar</button>
        </div>
      </div>
    `;

    // Función reactiva para actualizar el precio dinámicamente (actualizarPrecio)
    function actualizarPrecio() {
      let subtotal = prod.precio;
      const extrasSeleccionados = [];

      modalCuerpo.querySelectorAll('.chk-extra:checked').forEach(chk => {
        const extraPrecio = parseFloat(chk.getAttribute('data-precio')) || 0;
        const extraNombre = chk.getAttribute('data-nombre');
        subtotal += extraPrecio;
        extrasSeleccionados.push(extraNombre);
      });

      const spanPrecio = document.getElementById('modal-precio-total');
      if (spanPrecio) {
        spanPrecio.textContent = `S/ ${subtotal.toFixed(2)}`;
      }

      // Actualizar enlace de WhatsApp
      const btnWhatsapp = document.getElementById('btn-pedir-whatsapp-modal');
      if (btnWhatsapp) {
        let textoMensaje = `Hola ATR Brostería, quiero pedir: *${prod.nombre}* (S/ ${prod.precio.toFixed(2)})`;
        if (extrasSeleccionados.length > 0) {
          textoMensaje += `\nPersonalización:\n- ${extrasSeleccionados.join('\n- ')}`;
        }
        textoMensaje += `\nTotal: *S/ ${subtotal.toFixed(2)}*`;
        btnWhatsapp.href = `https://wa.me/51987654321?text=${encodeURIComponent(textoMensaje)}`;
      }
    }

    // Escuchar cambios en los checkboxes de personalización (onchange)
    modalCuerpo.querySelectorAll('.chk-extra').forEach(chk => {
      chk.addEventListener('change', actualizarPrecio);
    });

    // Calcular por primera vez
    actualizarPrecio();

    // Botón de cerrar secundario
    const btnCerrarSec = document.getElementById('btn-modal-cerrar-secundario');
    if (btnCerrarSec) {
      btnCerrarSec.addEventListener('click', cerrarModal);
    }

    // Mostrar modal
    modal.classList.remove('cerrado');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModal() {
    if (!modal) return;
    modal.classList.add('cerrado');
    document.body.style.overflow = '';
  }

  if (btnCerrarModal) {
    btnCerrarModal.addEventListener('click', cerrarModal);
  }

  // Cerrar al hacer clic fuera del contenido del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('cerrado')) {
      cerrarModal();
    }
  });

  // Render inicial
  renderizarFiltros();
  renderizarProductosCarta();
}

/* ====================================================================
   6. MÓDULO: PROMOCIONES (promociones.html)
   ==================================================================== */

function inicializarPaginaPromociones() {
  const contenedorDestacada = document.getElementById('promo-destacada-hoy');
  const contenedorGrid = document.getElementById('grid-promociones');

  if (!contenedorGrid) return;

  const diaHoy = new Date().getDay();
  const promoHoy = PROMOCIONES.find(p => p.diaIndice === diaHoy) || PROMOCIONES[1];

  // Tarjeta destacada superior
  if (contenedorDestacada) {
    contenedorDestacada.innerHTML = `
      <article class="tarjeta-promo-dia">
        <img src="${promoHoy.imagen}" alt="${promoHoy.titulo}" loading="lazy">
        <div class="promo-dia-cuerpo">
          <span class="etiqueta-dia"><i class="fa-solid fa-sparkles"></i> Promoción activa de hoy (${promoHoy.diaNombre})</span>
          <h3>${promoHoy.titulo}</h3>
          <div class="promo-precios">
            <span class="precio-nuevo">S/ ${promoHoy.precioNuevo.toFixed(2)}</span>
            <span class="precio-viejo">S/ ${promoHoy.precioViejo.toFixed(2)}</span>
          </div>
          <p class="desc">${promoHoy.descripcion}</p>
          <p class="horario"><i class="fa-solid fa-clock"></i> ${promoHoy.horario}</p>
          <div style="margin-top: 0.8rem;">
            <a href="https://wa.me/51987654321?text=${encodeURIComponent(promoHoy.whatsappMsg)}" class="btn btn-acento btn-grande" target="_blank" rel="noopener">
              <i class="fa-brands fa-whatsapp"></i> Pedir promoción de hoy
            </a>
          </div>
        </div>
      </article>
    `;
  }

  // Lista de todas las promociones
  contenedorGrid.innerHTML = PROMOCIONES.map(promo => {
    const esHoy = promo.diaIndice === diaHoy;
    return `
      <article class="tarjeta-promo ${esHoy ? 'promo-hoy' : ''}">
        <span class="dia-badge">${promo.diaNombre}</span>
        ${esHoy ? '<span class="hoy-cinta"><i class="fa-solid fa-star"></i> ¡HOY!</span>' : ''}
        <img src="${promo.imagen}" alt="${promo.titulo}" loading="lazy">
        <div class="promo-cuerpo">
          <h3>${promo.titulo}</h3>
          <p class="promo-desc">${promo.descripcion}</p>
          <div class="promo-precios-fila">
            <span class="nuevo">S/ ${promo.precioNuevo.toFixed(2)}</span>
            <span class="antes">S/ ${promo.precioViejo.toFixed(2)}</span>
          </div>
          <p class="promo-horario"><i class="fa-solid fa-clock"></i> ${promo.horario}</p>
          <a href="https://wa.me/51987654321?text=${encodeURIComponent(promo.whatsappMsg)}" class="btn ${esHoy ? 'btn-acento' : 'btn-primario'}" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp"></i> Pedir por WhatsApp
          </a>
        </div>
      </article>
    `;
  }).join('');
}

/* ====================================================================
   7. MÓDULO: GALERÍA Y LIGHTBOX (galeria.html)
   ==================================================================== */

function inicializarGaleria() {
  const gridGaleria = document.getElementById('grid-galeria');
  const lightbox = document.getElementById('lightbox');
  const lbImagen = document.getElementById('lb-imagen');
  const lbCaption = document.getElementById('lb-caption');
  const lbCerrar = document.getElementById('lb-cerrar');
  const lbAnterior = document.getElementById('lb-anterior');
  const lbSiguiente = document.getElementById('lb-siguiente');

  if (!gridGaleria) return;

  let indiceActual = 0;

  // Renderizar imágenes en la cuadrícula
  gridGaleria.innerHTML = FOTOS_GALERIA.map((foto, index) => `
    <figure class="item-galeria ${foto.destacada ? 'destacada' : ''}" data-index="${index}" tabindex="0" role="button" aria-label="Ver foto en tamaño completo: ${foto.caption}">
      <img src="${foto.src}" alt="${foto.caption}" loading="lazy">
      <figcaption>${foto.caption}</figcaption>
    </figure>
  `).join('');

  function mostrarEnLightbox(index) {
    if (!lightbox || !lbImagen || !lbCaption) return;
    indiceActual = (index + FOTOS_GALERIA.length) % FOTOS_GALERIA.length;
    const foto = FOTOS_GALERIA[indiceActual];
    lbImagen.src = foto.src;
    lbImagen.alt = foto.caption;
    lbCaption.textContent = foto.caption;
    lightbox.classList.remove('oculto');
    document.body.style.overflow = 'hidden';
  }

  function cerrarLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('oculto');
    document.body.style.overflow = '';
  }

  // Abrir foto al hacer click o presionar Enter
  gridGaleria.querySelectorAll('.item-galeria').forEach(item => {
    const handler = () => {
      const idx = parseInt(item.getAttribute('data-index'), 10);
      mostrarEnLightbox(idx);
    };
    item.addEventListener('click', handler);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });

  if (lbCerrar) lbCerrar.addEventListener('click', cerrarLightbox);
  if (lbAnterior) lbAnterior.addEventListener('click', () => mostrarEnLightbox(indiceActual - 1));
  if (lbSiguiente) lbSiguiente.addEventListener('click', () => mostrarEnLightbox(indiceActual + 1));

  // Cerrar haciendo clic en el fondo oscuro
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) cerrarLightbox();
    });
  }

  // Teclado: Escape para cerrar, flechas izquierda y derecha para navegar
  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.classList.contains('oculto')) return;
    if (e.key === 'Escape') cerrarLightbox();
    else if (e.key === 'ArrowLeft') mostrarEnLightbox(indiceActual - 1);
    else if (e.key === 'ArrowRight') mostrarEnLightbox(indiceActual + 1);
  });
}

/* ====================================================================
   8. MÓDULO: CONTACTO, COTIZADOR Y FAQ (contacto.html)
   ==================================================================== */

function inicializarContacto() {
  const formContacto = document.getElementById('form-contacto');
  const btnCotizador = document.getElementById('btn-cotizador');
  const resCotizador = document.getElementById('resultado-cotizador');
  const faqItems = document.querySelectorAll('.faq-item');

  // FAQ Acordeón interactivo
  faqItems.forEach(item => {
    const btnPregunta = item.querySelector('.faq-pregunta');
    const panelRespuesta = item.querySelector('.faq-respuesta');
    if (!btnPregunta || !panelRespuesta) return;

    btnPregunta.addEventListener('click', () => {
      const estaAbierto = btnPregunta.getAttribute('aria-expanded') === 'true';

      // Cerrar otros (comportamiento clásico acordeón)
      faqItems.forEach(otro => {
        const otroBtn = otro.querySelector('.faq-pregunta');
        const otroPanel = otro.querySelector('.faq-respuesta');
        if (otroBtn && otroPanel && otro !== item) {
          otroBtn.setAttribute('aria-expanded', 'false');
          otroPanel.hidden = true;
        }
      });

      // Alternar el actual
      btnPregunta.setAttribute('aria-expanded', !estaAbierto);
      panelRespuesta.hidden = estaAbierto;
    });
  });

  // Cotizador interactivo rápido de combos
  if (btnCotizador && resCotizador) {
    btnCotizador.addEventListener('click', () => {
      const entrada = prompt('¿Para cuántas personas deseas pedir hoy? (Ingresa un número del 1 al 15):', '4');
      if (entrada === null) return; // Cancelado

      const personas = parseInt(entrada.trim(), 10);
      if (isNaN(personas) || personas < 1) {
        alert('Por favor ingresa un número válido de personas.');
        return;
      }

      let recomendacion = '';
      let comboNombre = '';
      let precioEstimado = 0;

      if (personas === 1) {
        comboNombre = 'Combo Personal ATR';
        precioEstimado = 16.00;
        recomendacion = 'Ideal para ti solo: 1/4 de pollo broaster crujiente, papas doradas, ensalada y bebida fresca.';
      } else if (personas <= 3) {
        comboNombre = 'Combo Pareja ATR';
        precioEstimado = 32.00;
        recomendacion = 'Perfecto para 2 o 3 personas: 1/2 pollo broaster (2 presas grandes), porción familiar de papas y 2 bebidas.';
      } else if (personas <= 6) {
        comboNombre = 'Combo Familiar ATR';
        precioEstimado = 59.00;
        recomendacion = 'Nuestra recomendación estrella para la familia: 1 pollo entero (4 presas), papas gigantes, ensalada fresca y gaseosa de 1.5 L.';
      } else {
        comboNombre = 'Combo Fiesta ATR + 1/2 Pollo adicional';
        precioEstimado = 78.00 + 22.00;
        recomendacion = 'Para grupos grandes: Combo Fiesta con 6 presas grandes, papas dobles, 2 gaseosas de 1.5 L más 1/2 pollo adicional.';
      }

      resCotizador.innerHTML = `
        <div style="animation: aparecerArriba 0.35s ease;">
          <p style="margin: 0 0 0.5rem 0;">
            <i class="fa-solid fa-lightbulb" style="color:var(--color-acento);"></i> Para <strong>${personas} personas</strong>, te sugerimos:
          </p>
          <h4 style="margin: 0 0 0.4rem 0; font-size: 1.15rem; color: var(--color-primario);">
            ${comboNombre} — <strong>S/ ${precioEstimado.toFixed(2)}</strong>
          </h4>
          <p style="margin: 0 0 0.8rem 0; font-size: 0.92rem;">${recomendacion}</p>
          <a href="https://wa.me/51987654321?text=${encodeURIComponent(`Hola ATR Brostería, utilicé el cotizador para ${personas} personas y deseo ordenar el ${comboNombre} por S/ ${precioEstimado.toFixed(2)}`)}" class="btn btn-acento" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp"></i> Pedir esta cotización por WhatsApp
          </a>
        </div>
      `;
    });
  }

  // Validación robusta del formulario de contacto (RF-P4-01, RF-P4-02, RF-P4-03, RF-P4-04)
  if (formContacto) {
    const campos = {
      nombre: formContacto.querySelector('#nombre'),
      email: formContacto.querySelector('#email'),
      telefono: formContacto.querySelector('#telefono'),
      tipo: formContacto.querySelector('#tipo'),
      mensaje: formContacto.querySelector('#mensaje'),
      politicas: formContacto.querySelector('#politicas')
    };

    const alerta = document.getElementById('alerta-formulario');

    function mostrarError(campoNombre, mensaje) {
      const spanError = formContacto.querySelector(`[data-error-para="${campoNombre}"]`);
      if (spanError) {
        spanError.innerHTML = mensaje ? `<i class="fa-solid fa-triangle-exclamation"></i> ${mensaje}` : '';
      }
      if (campos[campoNombre]) {
        if (mensaje) {
          campos[campoNombre].style.borderColor = 'var(--color-error)';
        } else {
          campos[campoNombre].style.borderColor = '';
        }
      }
    }

    function validarCampo(nombre) {
      const el = campos[nombre];
      if (!el) return true;

      const valor = el.type === 'checkbox' ? el.checked : el.value.trim();

      switch (nombre) {
        case 'nombre':
          if (!valor) {
            mostrarError('nombre', 'El nombre es obligatorio.');
            return false;
          }
          if (valor.length < 3) {
            mostrarError('nombre', 'Ingresa al menos 3 caracteres.');
            return false;
          }
          mostrarError('nombre', '');
          return true;

        case 'email':
          const regexEmail = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
          if (!valor) {
            mostrarError('email', 'El correo electrónico es obligatorio.');
            return false;
          }
          if (!regexEmail.test(valor)) {
            mostrarError('email', 'Ingresa un correo electrónico válido (ej.: juan@correo.com).');
            return false;
          }
          mostrarError('email', '');
          return true;

        case 'telefono':
          const regexTel = /^9\d{8}$/;
          if (!valor) {
            mostrarError('telefono', 'El celular es obligatorio.');
            return false;
          }
          if (!regexTel.test(valor)) {
            mostrarError('telefono', 'El celular debe tener 9 dígitos y empezar con 9.');
            return false;
          }
          mostrarError('telefono', '');
          return true;

        case 'tipo':
          if (!valor) {
            mostrarError('tipo', 'Selecciona el motivo de tu consulta.');
            return false;
          }
          mostrarError('tipo', '');
          return true;

        case 'mensaje':
          if (!valor) {
            mostrarError('mensaje', 'El mensaje no puede estar vacío.');
            return false;
          }
          if (valor.length < 10) {
            mostrarError('mensaje', 'El mensaje debe tener al menos 10 caracteres.');
            return false;
          }
          mostrarError('mensaje', '');
          return true;

        case 'politicas':
          if (!valor) {
            mostrarError('politicas', 'Debes aceptar las políticas de tratamiento de datos.');
            return false;
          }
          mostrarError('politicas', '');
          return true;
      }
      return true;
    }

    const selectTipo = campos.tipo;
    const seccionProveedores = document.getElementById('seccion-proveedores');
    if (selectTipo && seccionProveedores) {
      selectTipo.addEventListener('change', () => {
        if (selectTipo.value === 'proveedor') {
          seccionProveedores.style.display = 'block';
        } else {
          seccionProveedores.style.display = 'none';
        }
      });
    }

    // Validación interactiva onblur y input
    Object.keys(campos).forEach(key => {
      const el = campos[key];
      if (el) {
        el.addEventListener('blur', () => validarCampo(key));
        el.addEventListener('input', () => {
          const span = formContacto.querySelector(`[data-error-para="${key}"]`);
          if (span && span.textContent !== '') {
            validarCampo(key);
          }
        });
      }
    });

    // Envío del formulario (onsubmit)
    formContacto.addEventListener('submit', (e) => {
      e.preventDefault();

      let esValido = true;
      Object.keys(campos).forEach(key => {
        if (!validarCampo(key)) esValido = false;
      });

      if (!esValido) {
        if (alerta) {
          alerta.className = 'campo-completo alerta alerta-error';
          alerta.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Por favor revisa los campos señalados en rojo antes de enviar.';
        }
        alert('Por favor corrige los errores en el formulario antes de continuar.');
        return;
      }

      // Guardar en el buzón de mensajes (localStorage)
      const inputEmpresa = document.getElementById('prov-empresa');
      const inputProducto = document.getElementById('prov-producto');
      const inputCantidad = document.getElementById('prov-cantidad');

      const datosMensaje = {
        nombre: campos.nombre.value.trim(),
        email: campos.email.value.trim(),
        telefono: campos.telefono.value.trim(),
        tipo: campos.tipo.value,
        mensaje: campos.mensaje.value.trim(),
        empresa: inputEmpresa && inputEmpresa.value ? inputEmpresa.value.trim() : null,
        productoOfertado: inputProducto && inputProducto.value ? inputProducto.value.trim() : null,
        cantidad: inputCantidad && inputCantidad.value ? inputCantidad.value.trim() : null
      };

      guardarMensajeContacto(datosMensaje);

      // Confirmación exitosa en pantalla (RF-P4-04)
      if (alerta) {
        alerta.className = 'campo-completo alerta alerta-exito';
        alerta.innerHTML = `
          <i class="fa-solid fa-circle-check"></i> 
          <strong>¡Mensaje enviado con éxito!</strong> Le responderemos en menos de 24 horas al celular <strong>${datosMensaje.telefono}</strong> o al correo <strong>${datosMensaje.email}</strong>.
        `;
      }

      alert(`¡Gracias ${datosMensaje.nombre}! Tu consulta ha sido registrada correctamente. En breve nos comunicaremos contigo.`);
      formContacto.reset();

      // Limpiar bordes
      Object.keys(campos).forEach(key => mostrarError(key, ''));
    });
  }
}

/* ====================================================================
   9. INICIALIZACIÓN GLOBAL
   ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  inicializarMenuMovil();
  actualizarEstadoLocal();
  actualizarAnioFooter();

  // Inicializadores por página según elementos existentes
  inicializarPaginaInicio();
  inicializarCartaDigital();
  inicializarPaginaPromociones();
  inicializarGaleria();
  inicializarContacto();

  // Refrescar estado del local cada minuto
  setInterval(actualizarEstadoLocal, 60000);
});

// Exportar globalmente funciones requeridas para pruebas e interacción administrativa
window.ATR = {
  obtenerProductos,
  toggleDisponibilidad,
  estaDisponible,
  guardarMensajeContacto,
  PROMOCIONES,
  PRODUCTOS_BASE
};

