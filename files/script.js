// ====== CONFIGURA AQUÍ ======
const WHATSAPP = "573128771062"; // tu número con código de país, sin + ni espacios
const MONEDA = n => "$" + n.toLocaleString("es-CO");
// ============================

const $ = s => document.querySelector(s);
const cart = {};

// Año del footer + enlace general de WhatsApp
$("#year").textContent = new Date().getFullYear();
$("#waMain").href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("¡Hola! Me interesa conocer los productos :) 🙌")}`;

// Luz que sigue el cursor
const glow = $("#glow");
addEventListener("pointermove", e => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// Aparición al hacer scroll + contadores
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    const c = en.target.querySelector(".count");
    if (c) countUp(c);
    io.unobserve(en.target);
  });
}, { threshold: .15 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 90 + "ms";
  io.observe(el);
});

function countUp(el) {
  const to = +el.dataset.to, t0 = performance.now(), dur = 1600;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

// Inclinación 3D en tarjetas
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});

// Carrito
const drawer = $("#drawer"), overlay = $("#overlay");
const toggle = on => {
  drawer.classList.toggle("on", on);
  overlay.classList.toggle("on", on);
  drawer.setAttribute("aria-hidden", !on);
};
$("#cartBtn").onclick = () => toggle(true);
$("#closeCart").onclick = overlay.onclick = () => toggle(false);

document.querySelectorAll(".add").forEach(btn => {
  btn.addEventListener("click", () => {
    const d = btn.closest(".card").dataset;
    cart[d.id] = cart[d.id] || { name: d.name, price: +d.price, qty: 0 };
    cart[d.id].qty++;
    render();
    toast("Agregado: " + d.name);
    const cb = $("#cartBtn");
    cb.classList.remove("bump"); void cb.offsetWidth; cb.classList.add("bump");
  });
});

function render() {
  const items = Object.entries(cart).filter(([, v]) => v.qty > 0);
  $("#cartList").innerHTML = items.length
    ? items.map(([id, v]) => `
      <li><span>${v.name}<br><small>${MONEDA(v.price)}</small></span>
      <span class="q"><button data-id="${id}" data-d="-1" aria-label="Quitar uno">−</button>${v.qty}<button data-id="${id}" data-d="1" aria-label="Agregar uno">+</button></span></li>`).join("")
    : '<li class="empty">Tu carrito está vacío. Elige algo que te guste 😉</li>';
  const total = items.reduce((s, [, v]) => s + v.price * v.qty, 0);
  $("#cartTotal").textContent = MONEDA(total);
  $("#cartCount").textContent = items.reduce((s, [, v]) => s + v.qty, 0);
}
$("#cartList").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  cart[b.dataset.id].qty += +b.dataset.d;
  render();
});

$("#checkout").onclick = () => {
  const items = Object.values(cart).filter(v => v.qty > 0);
  if (!items.length) return toast("Agrega al menos un producto");
  const lines = items.map(v => `• ${v.qty} x ${v.name} (${MONEDA(v.price * v.qty)})`).join("\n");
  const total = items.reduce((s, v) => s + v.price * v.qty, 0);
  const msg = `¡Hola! Quiero hacer este pedido:\n${lines}\n\nTotal: ${MONEDA(total)}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
};

let tt;
function toast(t) {
  const el = $("#toast");
  el.textContent = t; el.classList.add("on");
  clearTimeout(tt); tt = setTimeout(() => el.classList.remove("on"), 2000);
}
render();
