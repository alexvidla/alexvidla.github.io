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

        /* ---- RESERVA - ENVÍO A WHATSAPP ---- */
        document.getElementById('form-reserva').addEventListener('submit', e => {
            e.preventDefault();
            const datos = calcular();
            if (!datos) { alert('Selecciona Fechas Válidas.'); return; }
            const nombre  = document.getElementById('nombre').value;
            const suite   = sTipo.options[sTipo.selectedIndex].text;
            const adultos = document.getElementById('adultos').value;
            const ninos   = document.getElementById('ninos').value;
            const msg = `¡Hola! Me gustaría Confirmar una Reservación desde su Pagina Oficial, en *Hotel Alborada*:\n\n`
                      + `• *Huésped:* ${nombre}\n`
                      + `• *Habitación:* ${suite}\n`
                      + `• *Check-In:* ${fIn.value}\n`
                      + `• *Check-Out:* ${fOut.value}\n`
                      + `• *Estadía:* ${datos.noches} noche(s)\n`
                      + `• *Adultos:* ${adultos}\n`
                      + `• *Niños:* ${ninos}\n\n`
                      + `*Total estimado:* $${datos.total} MXN\n\n`
                      + `Quedo atento a la confirmación. ¡Gracias!`;
            window.open(`https://api.whatsapp.com/send?phone=${TELEFONO}&text=${encodeURIComponent(msg)}`, '_blank');
            e.target.reset();
            lblN.textContent = 'Estadía: —';
            lblT.textContent = '$0 MXN';
            const hoy = new Date().toISOString().split('T')[0];
            fIn.min = fOut.min = hoy;
        });

        const hoy = new Date().toISOString().split('T')[0];
        fIn.min = fOut.min = hoy;
