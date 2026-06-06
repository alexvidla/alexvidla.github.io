
                // Texto animado (máquina de escribir)
        const palabras = ["Recién Hecho ☕", "Granos Selectos 🫘", "Ambiente único 🎵", "Sabor que Inspira ✨"];
        let i = 0, j = 0, escribiendo = true;
        const typedEl = document.getElementById("typed");
        function animarTexto() {
            if (escribiendo) {
                if (j <= palabras[i].length) {
                    typedEl.textContent = palabras[i].substring(0, j);
                    j++;
                    setTimeout(animarTexto, 100);
                } else {
                    escribiendo = false;
                    setTimeout(animarTexto, 2000);
                }
            } else {
                if (j >= 0) {
                    typedEl.textContent = palabras[i].substring(0, j);
                    j--;
                    setTimeout(animarTexto, 50);
                } else {
                    escribiendo = true;
                    i = (i + 1) % palabras.length;
                    j = 0;
                    setTimeout(animarTexto, 500);
                }
            }
        }
        animarTexto();


        window.addEventListener("DOMContentLoaded", function() {
            new QRCode(document.getElementById("qr-code"), {
                text: window.location.href.split('#')[0] + "#menu",
                width: 180, height: 180, colorDark: "#fc6f03", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H
            });
        });

        const productos = [
            { nombre: "Café Americano", precio: 45 },
            { nombre: "Capuchino", precio: 55 },
            { nombre: "Latte", precio: 60 },
            { nombre: "Frappé", precio: 70 }
        ];

        const container = document.getElementById("productos-container");
        productos.forEach(p => {
            const card = document.createElement("div");
            card.className = "producto-card";
            card.innerHTML = `
                <i class="fas fa-mug-hot"></i>
                <h3>${p.nombre}</h3>
                <div class="precio">$${p.precio}</div>
                <div class="selector-cantidad">
                    <button class="btn-qty" onclick="cambiarQty(this, -1)">-</button>
                    <input type="text" class="input-qty" value="1" readonly>
                    <button class="btn-qty" onclick="cambiarQty(this, 1)">+</button>
                </div>
                <button class="btn-agregar" onclick="agregarAlCarrito(this)">➕ Agregar</button>
            `;
            container.appendChild(card);
        });

        const ofertas = [
            { nombre: "Café + Pastel", precio: 85, img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?w=400" },
            { nombre: "2x1 Capuchino", precio: 55, img: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=400" }
        ];
        const ofertasContainer = document.getElementById("ofertas-container");
        ofertas.forEach(of => {
            const card = document.createElement("div");
            card.className = "oferta-card";
            card.innerHTML = `
                <i class="fas fa-mug-hot"></i>
                <img src="${of.img}" style="width:100%; border-radius:20px; height:150px; object-fit:cover; margin-bottom:15px;">
                <h3>${of.nombre}</h3>
                <div class="precio">$${of.precio}</div>
                <div class="selector-cantidad">
                    <button class="btn-qty" onclick="cambiarQty(this, -1)">-</button>
                    <input type="text" class="input-qty" value="1" readonly>
                    <button class="btn-qty" onclick="cambiarQty(this, 1)">+</button>
                </div>
                <button class="btn-agregar" onclick="agregarAlCarrito(this)">➕ Agregar</button>
            `;
            ofertasContainer.appendChild(card);
        });

        function cambiarQty(btn, delta) {
            const input = btn.parentElement.querySelector('.input-qty');
            let valor = parseInt(input.value) + delta;
            if (valor < 1) valor = 1;
            input.value = valor;
        }

        const cards = document.querySelectorAll('.producto-card, .oferta-card');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.2 });
        cards.forEach(card => observer.observe(card));

        let carrito = [];

        function actualizarCarritoUI() {
            const cartItemsDiv = document.getElementById("cartItems");
            const cartTotalSpan = document.getElementById("cartTotal");
            const badge = document.getElementById("cartBadge");
            if (!cartItemsDiv) return;

            if (carrito.length === 0) {
                cartItemsDiv.innerHTML = '<p style="text-align:center; color:#999;">El Carrito está Vacío</p>';
                if (cartTotalSpan) cartTotalSpan.textContent = "$0.00";
                if (badge) badge.textContent = "0";
                return;
            }

            let html = "";
            let total = 0;
            let totalItems = 0;
            carrito.forEach((item, idx) => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;
                totalItems += item.cantidad;
                html += `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.nombre}</div>
                            <div class="cart-item-detail">${item.cantidad} x $${item.precio} = <strong>$${subtotal}</strong></div>
                        </div>
                        <button class="cart-remove" onclick="eliminarDelCarrito(${idx})">✕ Eliminar</button>
                    </div>
                `;
            });
            cartItemsDiv.innerHTML = html;
            if (cartTotalSpan) cartTotalSpan.textContent = `$${total}`;
            if (badge) badge.textContent = totalItems;
        }

        function agregarAlCarrito(btn) {
            const card = btn.closest('.producto-card, .oferta-card');
            if (!card) return;
            const nombre = card.querySelector('h3').innerText;
            const precioElement = card.querySelector('.precio');
            if (!precioElement) return;
            let precio = parseInt(precioElement.innerText.replace('$', ''));
            const inputQty = card.querySelector('.input-qty');
            let cantidad = inputQty ? parseInt(inputQty.value) : 1;
            const existente = carrito.find(item => item.nombre === nombre);
            if (existente) existente.cantidad += cantidad;
            else carrito.push({ nombre, precio, cantidad });
            actualizarCarritoUI();
            document.getElementById("cartDrawer").classList.add("open");
            // Pequeño feedback visual
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => { btn.style.transform = 'scale(1)'; }, 150);
        }

        function eliminarDelCarrito(idx) {
            carrito.splice(idx, 1);
            actualizarCarritoUI();
        }

        function enviarPedido() {
            if (carrito.length === 0) return alert("Agrega Productos Primero");
            let mensaje = "☕***Nuevo Pedido - SOPHYA CAFETERÍA***☕\n\n";
            let total = 0;
            carrito.forEach(item => {
                mensaje += `• ${item.nombre}: ${item.cantidad} x $${item.precio} = $${item.precio * item.cantidad}\n`;
                total += item.precio * item.cantidad;
            });
            mensaje += `\n💵 *TOTAL: $${total} MXN*`;
            window.open(`https://wa.me/529171173193?text=${encodeURIComponent(mensaje)}`, "_blank");
            carrito = [];
            actualizarCarritoUI();
            document.getElementById("cartDrawer").classList.remove("open");
            alert("✅ ¡Pedido enviado con éxito! En breve te contactaremos.");
        }

        document.getElementById("cartIcon").addEventListener("click", () => document.getElementById("cartDrawer").classList.add("open"));
        document.getElementById("closeCart").addEventListener("click", () => document.getElementById("cartDrawer").classList.remove("open"));
        document.getElementById("checkoutBtn").addEventListener("click", enviarPedido);

        document.addEventListener("click", (e) => {
            const drawer = document.getElementById("cartDrawer");
            const icon = document.getElementById("cartIcon");
            if (drawer && drawer.classList.contains("open")) {
                if (!drawer.contains(e.target) && !icon.contains(e.target)) drawer.classList.remove("open");
            }
        });

        const menuBtn = document.getElementById("menuHamburguesa");
        const nav = document.getElementById("nav");
        if (menuBtn && nav) {
            menuBtn.addEventListener("click", () => nav.classList.toggle("activo"));
            nav.querySelectorAll("a").forEach(enlace => enlace.addEventListener("click", () => nav.classList.remove("activo")));
        }
