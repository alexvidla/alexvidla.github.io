// ==========================================
// CARNICERÍA LOS MUCHACHOS - CARRITO FINAL
// ==========================================

let carrito = [];

// --- Popup de oferta ---
setTimeout(() => {
    const popup = document.getElementById('popup-oferta');
    if (popup) popup.style.display = 'flex';
}, 1500);

function cerrarPopup() {
    const popup = document.getElementById('popup-oferta');
    if (popup) popup.style.display = 'none';
}

// --- Abrir/Cerrar carrito lateral ---
function toggleCart() {
    const cart = document.getElementById("side-cart");
    if (cart) cart.classList.toggle("active");
}

// --- Cambiar cantidad en el selector de kg (dentro de cada tarjeta) ---
function cambiarQty(btn, cambio) {
    const input = btn.parentElement.querySelector('.input-qty');
    if (!input) return;
    let valor = parseFloat(input.value) + cambio;
    if (valor < 0.5) valor = 0.5;
    input.value = valor.toFixed(1);
}

// --- Agregar producto al carrito ---
function agregarAlCarrito(boton) {
    const card = boton.closest('.producto-card');
    if (!card) return;
    
    const inputQty = card.querySelector('.input-qty');
    let cantidad = 1.0;
    if (inputQty) cantidad = parseFloat(inputQty.value);
    
    let nombre = boton.getAttribute('data-name');
    if (!nombre) {
        const h3 = card.querySelector('h3');
        if (h3) nombre = h3.innerText;
    }
    
    let precio = parseFloat(boton.getAttribute('data-price'));
    if (isNaN(precio)) {
        const precioSpan = card.querySelector('.precio');
        if (precioSpan) precio = parseFloat(precioSpan.innerText);
    }
    
    if (isNaN(cantidad) || cantidad <= 0) cantidad = 1.0;
    
    agregarProducto(nombre, precio, cantidad);
    
    if (inputQty) inputQty.value = "1.0";
    
    // Abrir carrito
    const cart = document.getElementById("side-cart");
    if (cart) cart.classList.add("active");
}

function agregarProducto(nombre, precio, cantidad) {
    const itemExistente = carrito.find(p => p.nombre === nombre);
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({ nombre, precio, cantidad });
    }
    actualizarUI();
}

// --- Actualizar UI del carrito (con cantidad bien visible) ---
function actualizarUI() {
    const contenedor = document.getElementById("cart-items-container");
    const totalLabel = document.getElementById("cart-final-total");
    const badge = document.getElementById("cart-count-badge");
    
    if (!contenedor) return;
    
    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="empty-msg">El carrito está vacío</p>';
        if (badge) badge.innerText = "0";
        if (totalLabel) totalLabel.innerText = "$0.00";
        return;
    }
    
    let html = '';
    let total = 0;
    let totalItems = 0;
    
    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        totalItems += item.cantidad;
        
        const cantidadTexto = item.cantidad % 1 === 0 ? `${item.cantidad}.0 kg` : `${item.cantidad} kg`;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-detail">💰 Precio: $${item.precio} / kg</div>
                <div class="cart-item-controls">
                    <button class="cart-qty-btn" onclick="modificarCantidad(${index}, -0.5)">- 0.5 kg</button>
                    <span class="cart-item-qty" style="color: #ffcc00; background: #a80000; padding: 5px 12px; border-radius: 20px; font-weight: bold;">
                       ${cantidadTexto}</span>
                    
                    <button class="cart-qty-btn" onclick="modificarCantidad(${index}, 0.5)">+ 0.5 kg</button>
                    <button class="cart-remove-btn" onclick="eliminarItem(${index})">✕ Eliminar</button>
                </div>
                <div style="background: #a80000; color: #ffcc00; font-size: 15px; font-weight: bold; text-align: center; padding: 8px 12px; border-radius: 30px; margin-top: 10px;">
                    💵 Subtotal: $${subtotal.toFixed(2)}
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
    if (badge) badge.innerText = totalItems.toFixed(1);
    if (totalLabel) totalLabel.innerText = `$${total.toFixed(2)}`;
}














// --- Modificar cantidad desde el carrito ---
function modificarCantidad(index, delta) {
    if (!carrito[index]) return;
    const nueva = carrito[index].cantidad + delta;
    if (nueva <= 0) {
        carrito.splice(index, 1);
    } else {
        carrito[index].cantidad = parseFloat(nueva.toFixed(1));
    }
    actualizarUI();
}

// --- Eliminar item del carrito ---
function eliminarItem(index) {
    carrito.splice(index, 1);
    actualizarUI();
}

// --- Enviar pedido por WhatsApp y limpiar carrito ---
function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("❌ El Carrito está Vacío. Agrega Productos antes de Confirmar...");
        return;
    }
    
    let mensaje = "🥩 *NUEVO PEDIDO - CARNICERÍA LOS MUCHACHOS* 🥩\n\n";
    let total = 0;
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        mensaje += `• ${item.nombre}: ${item.cantidad} kg x $${item.precio} = $${subtotal.toFixed(2)}\n`;
        total += subtotal;
    });
    
    mensaje += `\n💵 *TOTAL A PAGAR: $${total.toFixed(2)} MXN*`;
    mensaje += `\n\n📞 *Para confirmar el pedido, te contactaremos pronto.*`;
    
    const telefono = '529612351137';
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
    
    // Limpiar carrito
    carrito = [];
    actualizarUI();
    
    alert("✅ ¡Pedido Enviado con éxito! En breve te Contactaremos...");
    
    // Cerrar carrito
    const cart = document.getElementById("side-cart");
    if (cart) cart.classList.remove("active");
}

// --- Cerrar carrito al hacer clic fuera ---
document.addEventListener('click', function(event) {
    const cart = document.getElementById('side-cart');
    const cartIcon = document.querySelector('.cart-icon-wrapper');
    
    if (cart && cart.classList.contains('active')) {
        // No cerrar si el clic fue en un botón del carrito
        if (event.target.closest('.cart-qty-btn') || event.target.closest('.cart-remove-btn')) {
            return;
        }
        if (!cart.contains(event.target) && !cartIcon?.contains(event.target)) {
            cart.classList.remove('active');
        }
    }
});

// --- Inicializar UI ---
document.addEventListener('DOMContentLoaded', function() {
    actualizarUI();
    
    // Centrar título del carrito
    const cartHeader = document.querySelector('.cart-header h3');
    if (cartHeader) {
        cartHeader.style.textAlign = 'center';
        cartHeader.style.width = '100%';
    }
});
