let i = 0;

const colores = ["#FF0000", "#FFA12E", "#D22EFF", "#2EA1FF"];
const button2 = document.querySelector(".button2");

button2.addEventListener("click", () => {
    i = (i + 1);
    if (i == 4) {
        i = 0;
    }
    document.body.style.backgroundColor = colores[i];
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
