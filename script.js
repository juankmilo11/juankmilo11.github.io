const boton_color = document.querySelector(".boton_color");

 window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".boton_titulo").click();
  });

boton_color.addEventListener("click", () => {

    // 1. Matiz (Hue): Elige cualquier color del arcoíris (0 a 360 grados)
    const h = Math.floor(Math.random() * 360);
    // 2. Saturación: Un porcentaje alto (70% - 90%) para que el color sea vivo y no grisáceo
    const s = Math.floor(Math.random() * 20) + 70; 
    // 3. Luminosidad (Lightness): EL TRUCO. Al dejarlo entre 15% y 35%, garantizamos que sea oscuro.
    // (Si baja de 15% se acerca mucho al negro, si sube de 40% empieza a ser muy claro).
    const l = Math.floor(Math.random() * 20) + 15; 
    // 4. Armamos el string en formato hsl(H, S%, L%)
    const colorOscuroAleatorio = `hsl(${h}, ${s}%, ${l}%)`;
    // 5. Lo aplicamos al fondo
    document.body.style.backgroundColor = colorOscuroAleatorio;
    
});

const estilos = [
    { fontSize: "55px"},
    { fontSize: "60px"},
    { fontSize: "50px"},
    { fontSize: "55px"},
    { fontSize: "60px"},
    { fontSize: "55px"},
    { fontSize: "60px"},
    { fontSize: "50px"},
    { fontSize: "55px"},
    { fontSize: "60px"}
];

const boton_titulo = document.querySelector(".boton_titulo");
const titulo = document.querySelector("h1");

boton_titulo.addEventListener("click", () => {
    estilos.forEach((estilo, posicion) => {
        setTimeout(() => {
            titulo.style.textAlign = "center";
            titulo.style.fontSize = estilo.fontSize;
        }, posicion * 150);
    });
});

function actualizarHora() {
    const ahora = new Date();

    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();

    horas = horas < 10 ? "0" + horas : horas;
    minutos = minutos < 10 ? "0" + minutos : minutos;

    document.getElementById("reloj").textContent = `${horas}:${minutos}`;
}

const boton_acc = document.querySelector(".boton_acc");

const yin = document.querySelector(".yin");
const yang = document.querySelector(".yang");

const velocidades = ['7s', '2s','0.5s','30s'];
let i = 0;

boton_acc.addEventListener("click", () => {

    // const velocidadAleatoria = (Math.random() * 50 + 0.5).toFixed(2);
    // yin.style.setProperty('--tiempo-rotacion', `${velocidadAleatoria}s`);
    // yang.style.setProperty('--tiempo-rotacion', `${velocidadAleatoria}s`);

    const nuevaVelocidad = velocidades[i];
    yin.style.setProperty('--tiempo-rotacion', nuevaVelocidad);
    yang.style.setProperty('--tiempo-rotacion', nuevaVelocidad);
    i = (i + 1) % velocidades.length;

});

actualizarHora();
setInterval(actualizarHora, 1000);

