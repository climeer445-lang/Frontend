// Botón pausar / reproducir el video
const video = document.querySelector(".video-fondo");
const boton = document.querySelector("#btn-video");

boton.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    boton.textContent = "⏸ Pausar video";
  } else {
    video.pause();
    boton.textContent = "▶ Reproducir video";
  }
});

// Contadores animados
const numeros = document.querySelectorAll(".numero");

numeros.forEach((el) => {
  const meta = Number(el.dataset.meta);
  let actual = 0;
  const paso = Math.max(1, Math.round(meta / 50));

  const reloj = setInterval(() => {
    actual += paso;
    if (actual >= meta) {
      actual = meta;
      clearInterval(reloj);
    }
    el.textContent = actual;
  }, 30);
});