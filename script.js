// ==========================================
// 1. TEXTO ANIMADO
// ==========================================
const frases = [
  "Diseño Profesional y Moderno...",
  "Páginas Web para tu Negocio...",
  "Presencia Digital que Impacta...",
  "Sitios Web que atraen más Clientes..."
];

let i = 0;
let j = 0;
let texto = "";
let escribiendo = true;

function escribir() {
  if (escribiendo) {
    if (j < frases[i].length) {
      texto += frases[i][j];
      j++;
    } else {
      escribiendo = false;
      setTimeout(escribir, 1500);
      return;
    }
  } else {
    if (j > 0) {
      texto = frases[i].substring(0, j - 1);
      j--;
    } else {
      escribiendo = true;
      i = (i + 1) % frases.length;
    }
  }
  const el = document.querySelector(".texto-animado");
  if(el) el.textContent = texto;
  setTimeout(escribir, 80);
}

window.onload = function() { escribir(); };

// ==========================================
// 2. MENÚ HAMBURGUESA
// ==========================================
const hamburguesa = document.getElementById('hamburguesa');
const menuLinks = document.getElementById('menu-links');
const menuEnlaces = document.querySelectorAll('.menu-link');

if(hamburguesa && menuLinks) {
  hamburguesa.addEventListener('click', function(e) {
    e.stopPropagation();
    menuLinks.classList.toggle('activo');
    const icono = hamburguesa.querySelector('i');
    if (icono) {
      if (menuLinks.classList.contains('activo')) {
        icono.classList.remove('fa-bars');
        icono.classList.add('fa-times');
      } else {
        icono.classList.remove('fa-times');
        icono.classList.add('fa-bars');
      }
    }
  });

  menuEnlaces.forEach(enlace => {
    enlace.addEventListener('click', function() {
      menuLinks.classList.remove('activo');
      const icono = hamburguesa.querySelector('i');
      if (icono) {
        icono.classList.remove('fa-times');
        icono.classList.add('fa-bars');
      }
    });
  });

  document.addEventListener('click', function(event) {
    if (menuLinks.classList.contains('activo')) {
      if (!menuLinks.contains(event.target) && !hamburguesa.contains(event.target)) {
        menuLinks.classList.remove('activo');
        const icono = hamburguesa.querySelector('i');
        if (icono) {
          icono.classList.remove('fa-times');
          icono.classList.add('fa-bars');
        }
      }
    }
  });
}

// ==========================================
// 3. SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(enlace => {
  enlace.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;
    const destino = document.querySelector(href);
    if (destino) {
      e.preventDefault();
      const offsetTop = destino.offsetTop - 70;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      if (menuLinks && menuLinks.classList.contains('activo')) {
        menuLinks.classList.remove('activo');
        const icono = hamburguesa?.querySelector('i');
        if (icono) {
          icono.classList.remove('fa-times');
          icono.classList.add('fa-bars');
        }
      }
    }
  });
});

// ==========================================
// 4. VALIDACIÓN DE FORMULARIO
// ==========================================
const form = document.getElementById('miFormulario');
if(form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('campo-nombre').value.trim();
    const email = document.getElementById('campo-email').value.trim();
    const mensaje = document.getElementById('campo-mensaje').value.trim();

    const errorNombre = document.getElementById('error-nombre');
    const errorEmail = document.getElementById('error-email');
    const errorMensaje = document.getElementById('error-mensaje');

    errorNombre.style.display = 'none';
    errorEmail.style.display = 'none';
    errorMensaje.style.display = 'none';

    let valido = true;

    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if(!regexNombre.test(nombre) || nombre.length < 3) {
      errorNombre.textContent = '❌ Por favor escribe un nombre válido, solo letras (mínimo 3 caracteres).';
      errorNombre.style.display = 'block';
      valido = false;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regexEmail.test(email)) {
      errorEmail.textContent = '❌ Por favor escribe un correo electrónico válido.';
      errorEmail.style.display = 'block';
      valido = false;
    }

    if(mensaje.length < 10) {
      errorMensaje.textContent = '❌ Por favor escribe un mensaje de al menos 10 caracteres.';
      errorMensaje.style.display = 'block';
      valido = false;
    }

    if(!valido) return;

    const boton = form.querySelector('button[type="submit"]');
    const textoOriginal = boton.textContent;
    boton.textContent = '⏳ Enviando...';
    boton.disabled = true;

    const data = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        form.style.display = 'none';
        const mensajeExito = document.getElementById('mensaje-exito');
        if (mensajeExito) mensajeExito.style.display = 'block';
        setTimeout(() => {
          form.style.display = 'flex';
          if (mensajeExito) mensajeExito.style.display = 'none';
        }, 5000);
      } else {
        alert('❌ Hubo un error al enviar. Por favor, intenta de nuevo.');
        form.style.display = 'flex';
      }
    } catch (error) {
      alert('❌ Error de conexión. Verifica tu internet e intenta de nuevo.');
      form.style.display = 'flex';
    } finally {
      boton.textContent = textoOriginal;
      boton.disabled = false;
    }
  });
}

// ==========================================
// 5. POPUP
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  const popup = document.getElementById('miPopup');
  const cerrarPopup = document.getElementById('cerrarPopupBtn');
  const accionPopup = document.getElementById('accionPopupBtn');
  
  if (popup) {
    setTimeout(() => {
      popup.style.opacity = '1';
      popup.style.visibility = 'visible';
    }, 1500);
    
    if (cerrarPopup) {
      cerrarPopup.onclick = function() {
        popup.style.opacity = '0';
        popup.style.visibility = 'hidden';
      };
    }
    
    if (accionPopup) {
      accionPopup.onclick = function() {
        const contacto = document.getElementById('contacto');
        if (contacto) contacto.scrollIntoView({ behavior: 'smooth' });
        popup.style.opacity = '0';
        popup.style.visibility = 'hidden';
      };
    }
    
    popup.onclick = function(e) {
      if (e.target === popup) {
        popup.style.opacity = '0';
        popup.style.visibility = 'hidden';
      }
    };
  }
});

// ==========================================
// 6. CONTADOR ANIMADO
// ==========================================
/*document.addEventListener('DOMContentLoaded', function() {
  const contenedor = document.querySelector('.contenedor');
  const existeContador = document.getElementById('contador-proyectos');
  
  if (!existeContador && contenedor) {
    const seccionContador = document.createElement('div');
    seccionContador.id = 'contador-proyectos';
    seccionContador.className = 'contador-seccion';
    seccionContador.style.cssText = `
      background: linear-gradient(135deg, #0f3460, #16213e);
      border-radius: 20px;
      padding: 40px 20px;
      margin: 40px 0;
      text-align: center;
      border: 1px solid #fc6f03;
    `;
    seccionContador.innerHTML = `
      <h2 class="subtitulo" style="margin-top: 0;">Mi impacto</h2>
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 40px;">
        <div class="contador-item"><div class="contador-numero" id="contador-proyectos-num">0</div><div class="contador-label">Proyectos Web</div></div>
        <div class="contador-item"><div class="contador-numero" id="contador-clientes-num">0</div><div class="contador-label">Clientes Satisfechos</div></div>
        <div class="contador-item"><div class="contador-numero" id="contador-anos-num">0</div><div class="contador-label">Años de Experiencia</div></div>
      </div>
    `;
    
    const habilidades = document.querySelector('ul');
    if (habilidades && habilidades.parentNode) {
      habilidades.parentNode.insertBefore(seccionContador, habilidades.nextSibling);
    } else {
      contenedor.appendChild(seccionContador);
    }
  }

  let contadoresActivados = false;
  
  function animarContador(id, objetivo) {
    let actual = 0;
    const incremento = Math.ceil(objetivo / 50);
    const elemento = document.getElementById(id);
    if (!elemento) return;
    const intervalo = setInterval(() => {
      actual += incremento;
      if (actual >= objetivo) {
        elemento.textContent = objetivo;
        clearInterval(intervalo);
      } else {
        elemento.textContent = actual;
      }
    }, 30);
  }

  function verificarContador() {
    const seccion = document.getElementById('contador-proyectos');
    if (!seccion || contadoresActivados) return;
    const rect = seccion.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      contadoresActivados = true;
      animarContador('contador-proyectos-num', 15);
      animarContador('contador-clientes-num', 12);
      animarContador('contador-anos-num', 3);
    }
  }

  window.addEventListener('scroll', verificarContador);
  setTimeout(verificarContador, 500);
});*/

// ==========================================
// 7. REVELADO DE ELEMENTOS AL SCROLL
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  const elementosOcultos = document.querySelectorAll('.tarjeta, .testimonio, .red, .hero');
  elementosOcultos.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  function revelarElementos() {
    elementosOcultos.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  }
  
  window.addEventListener('scroll', revelarElementos);
  setTimeout(revelarElementos, 300);
});

console.log('✨ Alex VIDLA Dev - Página cargada correctamente');

// ==========================================
// BLOG: SOLO UNO ABIERTO - SIN ESPACIOS FANTASMA
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar TODOS los contenidos completos desde el inicio
    const todosLosContenidos = document.querySelectorAll('.blog-completo');
    todosLosContenidos.forEach(contenido => {
        contenido.style.display = 'none';
    });

    const botonesLeerMas = document.querySelectorAll('.blog-leer-mas');
    
    botonesLeerMas.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const articuloActual = this.closest('.entrada-blog');
            const contenidoActual = articuloActual.querySelector('.blog-completo');
            
            // Si el contenido actual está visible, lo cerramos (lo eliminamos visualmente)
            if (contenidoActual && contenidoActual.style.display === 'block') {
                contenidoActual.style.display = 'none';
                this.textContent = 'Leer más →';
                return;
            }
            
            // Cerrar todos los demás artículos (ocultar sus divs)
            const todosLosArticulos = document.querySelectorAll('.entrada-blog');
            todosLosArticulos.forEach(articulo => {
                const contenido = articulo.querySelector('.blog-completo');
                const boton = articulo.querySelector('.blog-leer-mas');
                if (contenido && contenido !== contenidoActual) {
                    contenido.style.display = 'none';
                    if (boton) boton.textContent = 'Leer más →';
                }
            });
            
            // Abrir el artículo actual (mostrar el div)
            if (contenidoActual) {
                contenidoActual.style.display = 'block';
                this.textContent = 'Leer menos ↑';
            }
        });
    });
});

// ==========================================
// BLOG: LEER MÁS - VERSIÓN EXTREMA (funciona siempre)
// ==========================================
(function() {
    function iniciarBlog() {
        var botones = document.querySelectorAll('.blog-leer-mas');
        console.log('Botones encontrados:', botones.length);
        
        for (var i = 0; i < botones.length; i++) {
            var boton = botones[i];
            boton.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var articulo = this.parentNode.parentNode;
                var contenido = articulo.querySelector('.blog-completo');
                
                if (!contenido) {
                    console.log('No se encontró .blog-completo');
                    return;
                }
                
                // Cerrar todos los demás
                var todosLosArticulos = document.querySelectorAll('.entrada-blog');
                for (var j = 0; j < todosLosArticulos.length; j++) {
                    var otroArticulo = todosLosArticulos[j];
                    var otroContenido = otroArticulo.querySelector('.blog-completo');
                    var otroBoton = otroArticulo.querySelector('.blog-leer-mas');
                    if (otroContenido && otroContenido !== contenido) {
                        otroContenido.style.display = 'none';
                        if (otroBoton) otroBoton.textContent = 'Leer más →';
                    }
                }
                
                // Abrir o cerrar el actual
                if (contenido.style.display === 'block') {
                    contenido.style.display = 'none';
                    this.textContent = 'Leer más →';
                } else {
                    contenido.style.display = 'block';
                    this.textContent = 'Leer menos ↑';
                }
                
                return false;
            };
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarBlog);
    } else {
        iniciarBlog();
    }
})();

// Contador animado
function iniciarContador() {
    const proyectos = document.getElementById('proyectosCont');
    const clientes = document.getElementById('clientesCont');
    const experiencia = document.getElementById('experienciaCont');
    if (!proyectos) return;

    let contadorActivado = false;

    function animarContador(elemento, objetivo) {
        let actual = 0;
        const incremento = Math.ceil(objetivo / 50);
        const intervalo = setInterval(() => {
            actual += incremento;
            if (actual >= objetivo) {
                elemento.textContent = objetivo;
                clearInterval(intervalo);
            } else {
                elemento.textContent = actual;
            }
        }, 30);
    }

    window.addEventListener('scroll', () => {
        const seccionContador = document.querySelector('.contador-seccion');
        if (!seccionContador) return;
        const rect = seccionContador.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && !contadorActivado) {
            contadorActivado = true;
            animarContador(proyectos, 12);
            animarContador(clientes, 10);
            animarContador(experiencia, 3);
        }
    });
}
document.addEventListener('DOMContentLoaded', iniciarContador);

// ==========================================
// BOTÓN FLOTANTE "VOLVER ARRIBA"
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const btnArriba = document.getElementById('btnVolverArriba');
    if (!btnArriba) return;

    // Mostrar/ocultar según el scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {

            btnArriba.style.display = 'flex';
            btnArriba.style.alignItems = 'center';
            btnArriba.style.justifyContent = 'center';
        } else {
            btnArriba.style.display = 'none';
        }
    });

    // Acción al hacer clic
    btnArriba.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});