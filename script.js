let i = 0;

const colores = ["#FF0000", "#FFA12E", "#D22EFF", "#2EA1FF","#27F52E"];
const button2 = document.querySelector(".button2");

 window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".button1").click();
  });

button2.addEventListener("click", () => {
    i = (i + 1);
    if (i == 5) {
        i = 0;
    }
    document.body.style.backgroundColor = colores[i];
});

const estilos = [
    { fontFamily: "serif", fontSize: "55px"},
    { fontFamily: "sans-serif", fontSize: "55px"},
    { fontFamily: "monospace", fontSize: "60px"},
    { fontFamily: "cursive", fontSize: "50px"},
    { fontFamily: "fantasy", fontSize: "55px"},
    { fontFamily: "cursive", fontSize: "50px"},
    { fontFamily: "monospace", fontSize: "55px"},
    { fontFamily: "sans-serif", fontSize: "60px"},
    { fontFamily: "serif", fontSize: "55px"},
    { fontFamily: "sans-serif", fontSize: "60px"},
    { fontFamily: "monospace", fontSize: "50px"},
    { fontFamily: "cursive", fontSize: "55px"},
    { fontFamily: "fantasy", fontSize: "60px"},
    { fontFamily: "cursive", fontSize: "50px"},
    { fontFamily: "monospace", fontSize: "55px"},
    { fontFamily: "sans-serif", fontSize: "50px"},
    { fontFamily: 'Verdana', fontSize: "55px"}
];

const button1 = document.querySelector(".button1");
const titulo = document.querySelector("h1");

button1.addEventListener("click", () => {
    estilos.forEach((estilo, posicion) => {
        setTimeout(() => {
            titulo.style.textAlign = "center";
            titulo.style.fontSize = estilo.fontSize;
            titulo.style.fontFamily = estilo.fontFamily;
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

actualizarHora();
setInterval(actualizarHora, 1000);

