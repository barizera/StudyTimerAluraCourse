const html = document.querySelector("html");
//botões:
const btFoco = document.querySelector(".app__card-button--foco");
const btCurto = document.querySelector(".app__card-button--curto");
const btLongo = document.querySelector(".app__card-button--longo");
const btStartPause = document.querySelector("#start-pause span");
const imgBtStartPause = document.querySelector(".app__card-primary-butto-icon");
const botoes = document.querySelectorAll(".app__card-button");
const btReset = document.querySelector("#reset__bt");
//Alterações:
const textoTitulo = document.querySelector(".app__title");
const imgTitulo = document.querySelector(".app__image");
const tempoNaTela = document.querySelector(".app__card-timer");

//Áudios:
const endTime = new Audio("/sons/beep.mp3");
const pauseTime = new Audio("/sons/pause.mp3");
const playTime = new Audio("/sons/play.wav");

//Marcadores de tempo:
let tempoFoco = 1500;
let tempoCurto = 300;
let tempoLongo = 900;
let tempoDecorrido = 1500;

//AddEventListener:
btFoco.addEventListener("click", () => {
  tempoDecorrido = 1500;
  alterarContexto("foco");
  btFoco.classList.add("active");
  resetar();
});
btCurto.addEventListener("click", () => {
  tempoDecorrido = 300;
  alterarContexto("descanso-curto");
  btCurto.classList.add("active");
  resetar();
});
btLongo.addEventListener("click", () => {
  tempoDecorrido = 900;
  alterarContexto("descanso-longo");
  btLongo.classList.add("active");
  resetar();
});
btStartPause.addEventListener("click", () => {
  iniciarEPausar();
});

btReset.addEventListener("click", () => {
  if (html.getAttribute("data-contexto") === "foco") {
    tempoDecorrido = 1500;
    resetar();
    mostrarTela();
  }
  if (html.getAttribute("data-contexto") === "descanso-curto") {
    tempoDecorrido = 300;
    resetar();
    mostrarTela();
  }

  if (html.getAttribute("data-contexto") === "descanso-longo") {
    tempoDecorrido = 900;
    resetar();
    mostrarTela();
  }
});

//Functions:
function alterarContexto(contexto) {
  mostrarTela();
  botoes.forEach(function (contexto) {
    contexto.classList.remove("active");
  });
  html.setAttribute("data-contexto", contexto);
  imgTitulo.setAttribute("src", `/imagens/${contexto}.png`);
  switch (contexto) {
    case "foco":
      textoTitulo.innerHTML = ` Otimize sua produtividade,<br>
      <strong class="app__title-strong">mergulhe no que importa.</strong> `;

      break;
    case "descanso-curto":
      textoTitulo.innerHTML = `
        Que tal dar uma respirada? <strong class="app__title-strong"> Faça uma pausa curta! </strong>
        `;
      break;
    case "descanso-longo":
      textoTitulo.innerHTML = ` Hora de voltar à superfície. <strong class="app__title-strong">Faça uma pausa longa. </strong>`;
      break;
    default:
      break;
  }
}

function contagemRegressiva() {
  if (tempoDecorrido <= 0) {
    endTime.play();
    alert(`Tempo Esgotado`);
    const focoAtivo = html.getAttribute("data-contexto") == "foco";
    if (focoAtivo) {
      const evento = new CustomEvent("FocoFinalizado");
      document.dispatchEvent(evento);
    }
    resetar();
    return;
  }
  tempoDecorrido -= 1;
  mostrarTela();
}

let intervalo_id = null;

function iniciarEPausar() {
  if (intervalo_id) {
    pauseTime.play();
    resetar();
    return;
  }
  playTime.play();
  intervalo_id = setInterval(contagemRegressiva, 1000);
  imgBtStartPause.setAttribute("src", "/imagens/pause.png");
  btStartPause.textContent = "Pausar";
}

function resetar() {
  clearInterval(intervalo_id);
  intervalo_id = null;
  imgBtStartPause.setAttribute("src", "/imagens/play_arrow.png");
  btStartPause.textContent = "Começar";
}

function mostrarTela() {
  const tempo = new Date(tempoDecorrido * 1000); // multiplica por 1000 porque é em milisegundos
  const tempoFormatado = tempo.toLocaleTimeString("pt-br", {
    minute: "2-digit",
    second: "2-digit",
  });
  tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTela();
