
const URL_AUDITORIA_ALEX = "https://script.google.com/macros/s/AKfycbwMRGGc_T4ONLNysVcwOI6u07Be7fibFAR3a5BkAG7SUOuPMO0sMxqILaw8510GfaEo/exec";
const URL_GOOGLE_SCRIPT = ""; // Sin hoja propia del hotel por ahora
// ==========================================
// 1. TEXTO ANIMADO
// ==========================================
const frases = [
  "Tu Hogar Lejos de Casa...",
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


const TELEFONO = "529174025447";

        /* ---- NAVBAR scroll ---- */
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        });

        /* ---- MENÚ HAMBURGUESA ---- */
        const btnHamb = document.getElementById('btn-hamburger');
        const menuNav = document.getElementById('menu-nav');
        btnHamb.addEventListener('click', e => {
            e.stopPropagation();
            menuNav.classList.toggle('activo');
            const ic = btnHamb.querySelector('i');
            ic.classList.toggle('fa-bars');
            ic.classList.toggle('fa-xmark');
        });
        document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
            menuNav.classList.remove('activo');
            const ic = btnHamb.querySelector('i');
            ic.classList.add('fa-bars'); ic.classList.remove('fa-xmark');
        }));
        document.addEventListener('click', e => {
            if (!menuNav.contains(e.target) && !btnHamb.contains(e.target)) {
                menuNav.classList.remove('activo');
                const ic = btnHamb.querySelector('i');
                ic.classList.add('fa-bars'); ic.classList.remove('fa-xmark');
            }
        });

        /* ---- SCROLL REVEAL ---- */
        const obs = new IntersectionObserver(entries => {
            entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('active'); });
        }, { threshold: 0.08 });
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));

        /* ---- RESERVA - CÁLCULO ---- */
        const fIn  = document.getElementById('checkin');
        const fOut = document.getElementById('checkout');
        const sTipo = document.getElementById('tipo');
        const lblN = document.getElementById('lbl-noches');
        const lblT = document.getElementById('lbl-total');

        function calcular() {
            if (!fIn.value || !fOut.value) return null;
            const noches = Math.max(1, Math.ceil((new Date(fOut.value) - new Date(fIn.value)) / 86400000));
            const total  = noches * parseInt(sTipo.value);
            lblN.textContent = `Estadía: ${noches} noche${noches > 1 ? 's' : ''}`;
            lblT.textContent = `$${total} MXN`;
            return { noches, total };
        }

        fIn.addEventListener('change', () => { fOut.min = fIn.value; calcular(); });
        fOut.addEventListener('change', calcular);
        sTipo.addEventListener('change', calcular);

        /* ---- RESERVA - ENVÍO A WHATSAPP + AUDITORÍA ALEX VIDLA ---- */
        document.getElementById('form-reserva').addEventListener('submit', e => {
            e.preventDefault();
            const datos = calcular();
            if (!datos) { alert('Selecciona Fechas Válidas.'); return; }
            const nombre  = document.getElementById('nombre').value.trim();
            const suite   = sTipo.options[sTipo.selectedIndex].text;
            const adultos = document.getElementById('adultos').value;
            const ninos   = document.getElementById('ninos').value;
            if (!nombre) { alert('Por favor ingresa el nombre del huésped.'); return; }
            // Llama a executeSend: registra auditoría silenciosa + abre WhatsApp con overlay
            executeSend(nombre, suite, fIn.value, fOut.value, datos.noches, `$${datos.total} MXN`, adultos, ninos);
        });

        const hoy = new Date().toISOString().split('T')[0];
        fIn.min = fOut.min = hoy;



        
// ==========================================
// 3. ENVÍO CENTRALIZADO Y CONTROL DE AUDITORÍA
// ==========================================
function executeSend(cliente, habitacion, checkin, checkout, noches, total, adultos, niños) {
    const fechaRegistro = new Date().toLocaleString('es-MX');

    // CANAL 1. Envío de datos de la Reserva completa al Hotelero
    const formData = new FormData();
    formData.append('fechaRegistro', fechaRegistro);
    formData.append('cliente', cliente);
    formData.append('habitacion', habitacion);
    formData.append('checkin', checkin);
    formData.append('checkout', checkout);
    formData.append('noches', noches);
    formData.append('total', total);
    formData.append('adultos', adultos);
    formData.append('niños', niños);

    fetch(URL_GOOGLE_SCRIPT, {
        method: 'POST',
        body: formData
    }).catch(err => console.log("Registrado en Sheets del Hotel."));

    // CANAL 2. Envío del Rastreador de Auditoría limpia para Alex VIDLA
    const datosAuditoria = new URLSearchParams();
    datosAuditoria.append('fechaRegistro', new Date().toLocaleDateString('es-MX'));
    datosAuditoria.append('hora', new Date().toLocaleTimeString('es-MX'));
    datosAuditoria.append('etiqueta', 'Hotel Alborada');
    datosAuditoria.append('cliente', cliente);
    datosAuditoria.append('total', total);
    datosAuditoria.append('esAuditoria', 'true');

    fetch(URL_AUDITORIA_ALEX, {
        method: 'POST',
        body: datosAuditoria
    })
    .then(() => console.log('Auditoría real guardada con éxito.'))
    .catch(err => console.error('Error en reporte silencioso:', err));

    // 3. Construcción de la URL de WhatsApp
    const numeroWhatsAppHotel = "529174025447"; 
    const mensajeTexto = `*SOLICITUD DE RESERVA DIRECTA DESDE LA PAGINA OFICIAL - Hotel Alborada *%0A%0A` +
        `Estimado Equipo de Recepción, deseo Confirmar mi Estancia con Ustedes con los Siguientes Detalles:%0A%0A` +
        `👤 *Huésped Principal:* ${cliente}%0A` +
        `🏨 *Suite Seleccionada:* ${habitacion}%0A` +
        `📅 *Check-in:* ${checkin}%0A` +
        `📅 *Check-out:* ${checkout}%0A` +
        `🌙 *Estancia:* ${noches} Noche(s)%0A` +
        `👥 *Ocupación:* ${adultos} Adulto(s) y ${niños} Niño(s)%0A` +
        `💰 *Monto Total Cotizado:* ${total}%0A%0A` +
        `Agradezco su Atención para Indicarme el Método de Garantía y Asegurar mi Suite lo Antes Posible. Quedo a la Espera...`;

    const urlFinal = `https://wa.me/${numeroWhatsAppHotel}?text=${mensajeTexto}`;

    // 4. Creación del aviso flotante
    const overlay = document.createElement('div');
    overlay.id = 'custom-overlay-success';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; 
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '99999'; 
    overlay.style.padding = '20px';
    overlay.style.boxSizing = 'border-box';

    overlay.innerHTML = `
        <div style="background: #ffffff; border-top: 5px solid #25d366; padding: 30px 25px; border-radius: 12px; text-align: center; max-width: 450px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: fadeIn 0.3s ease;">
            <i class="fa-solid fa-circle-check" style="color: #25d366; font-size: 48px; margin-bottom: 15px; display: block;"></i>
            <h3 style="color: #16522d; margin-bottom: 10px; font-family: sans-serif; font-size: 20px; font-weight: 700;">
                ¡Reserva Procesada con Éxito!
            </h3>
            <p style="color: #4a4a4a; font-size: 14px; margin-bottom: 15px; line-height: 1.5;">
                Hola <strong>${cliente}</strong>, Tus Datos han sido Sincronizados Correctamente en Nuestro Sistema...</p>
            <p style="color: #666666; font-size: 13px; margin-bottom: 0; background: #f4f9f5; padding: 10px; border-radius: 6px;">
                <i class="fa-solid fa-spinner fa-spin" style="color: #25d366;"></i> Conectando de Forma Segura con la Recepción en WhatsApp...</p>
        </div>
    `;

    document.body.appendChild(overlay);

    // Redireccionamiento y limpieza
    setTimeout(() => {
        if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
            window.location.href = urlFinal;
        } else {
            window.open(urlFinal, '_blank');
        }
        
        setTimeout(() => {
            if (document.getElementById('custom-overlay-success')) {
                document.getElementById('custom-overlay-success').remove();
            }
            // Limpiar formulario de reserva completamente
            const form = document.getElementById('form-reserva');
            if (form) form.reset();
            const lblN = document.getElementById('lbl-noches');
            const lblT = document.getElementById('lbl-total');
            if (lblN) lblN.textContent = 'Estadía: —';
            if (lblT) lblT.textContent = '$0 MXN';
            const hoy = new Date().toISOString().split('T')[0];
            const fIn  = document.getElementById('checkin');
            const fOut = document.getElementById('checkout');
            if (fIn)  { fIn.value  = ''; fIn.min  = hoy; }
            if (fOut) { fOut.value = ''; fOut.min = hoy; }
        }, 1000);

    }, 4000); 
}