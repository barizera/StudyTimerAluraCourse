const btAdicionarTarefa = document.querySelector(".app__button--add-task");
const formAddTarefa = document.querySelector(".app__form-add-task");
const textArea = document.querySelector(".app__form-textarea");
const ulTarefas = document.querySelector(".app__section-task-list");
const paragrafoDescricaoTarefa = document.querySelector(
  ".app__section-active-task-description"
);
const btRemoverConcluidas = document.querySelector("#btn-remover-concluidas");
const btRemoverTodas = document.querySelector("#btn-remover-todas");

const btCancelar = document.querySelector(".app__form-footer__button--cancel");

let tarefaSelecionada = null;
let liTarefaSelecionada = null;
// Adicionamos o "|| []" porque no google chrome estava dando nnull.
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function atualizarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas)); //atualiza o localStorage.
}

function criarElementoTarefa(tarefa) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svg = document.createElement("svg");
  svg.innerHTML = `  
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
  `;

  const paragrafo = document.createElement("p");
  paragrafo.textContent = tarefa.descricao;
  paragrafo.classList.add("app__section-task-list-item-description");

  const botao = document.createElement("button");
  botao.classList.add("app_button-edit");

  botao.onclick = () => {
    // debugger
    const novaDescricao = prompt("Qual é o novo nome da tarefa?");

    if (novaDescricao) {
      paragrafo.textContent = novaDescricao;
      tarefa.descricao = novaDescricao;
    }
    console.log(`Nova descrição da tarefa é: ${novaDescricao}`);
  };

  const imgBotao = document.createElement("img");
  imgBotao.setAttribute("src", "/imagens/edit.png");
  botao.append(imgBotao);

  // ORGANIZAÇÃO - ONDE CADA ELEMENTO VAI SER LOCALIZADO
  li.append(svg);
  li.append(paragrafo);
  li.append(botao);

  btCancelar.addEventListener("click", () => {
    limparFormTextArea();
  });

  // ALTERANDO A COR DA TAREFA \/

  if (tarefa.completa) {
    li.classList.add("app__section-task-list-item-complete");
    botao.setAttribute("disabled", "disabled");
  } else {
    li.onclick = () => {
      document
        .querySelectorAll(".app__section-task-list-item-active")
        .forEach((elemento) => {
          elemento.classList.remove("app__section-task-list-item-active");
        });
      if (tarefaSelecionada == tarefa) {
        paragrafoDescricaoTarefa.textContent = "";
        tarefaSelecionada = null;
        liTarefaSelecionada = null;
        return;
      }
      tarefaSelecionada = tarefa;
      liTarefaSelecionada = li;
      paragrafoDescricaoTarefa.textContent = tarefa.descricao;
      li.classList.add("app__section-task-list-item-active");
    };
  }

  return li;
}

function limparFormTextArea() {
  textArea.value = "";
  formAddTarefa.classList.add("hidden");
}

btAdicionarTarefa.addEventListener("click", () => {
  formAddTarefa.classList.toggle("hidden");
});

formAddTarefa.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const tarefa = {
    descricao: textArea.value,
  };
  tarefas.push(tarefa);
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa); // o elementoTarefa vai se inserir dentro do ulTarefas, dentro da div.
  atualizarTarefas(); // Para não ficar copiando e colando o mesmo código, foi criada a function.
  limparFormTextArea();
});

tarefas.forEach((tarefa) => {
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);
});

document.addEventListener("FocoFinalizado", () => {
  if (tarefaSelecionada && liTarefaSelecionada) {
    liTarefaSelecionada.classList.remove("app__section-task-list-item-active");
    liTarefaSelecionada.classList.add("app__section-task-list-item-complete");
    liTarefaSelecionada
      .querySelector("button")
      .setAttribute("disabled", "disabled");
    tarefaSelecionada.completa = true;
    atualizarTarefas();
  }
});

const removerTarefas = (somenteCompletas) => {
  let seletor = ".app__section-task-list-item";
  if (somenteCompletas) {
    seletor = ".app__section-task-list-item-complete";
  }
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });
  tarefas = somenteCompletas
    ? tarefas.filter((tarefa) => !tarefa.completa)
    : [];
  atualizarTarefas();
};

btRemoverConcluidas.onclick = () => removerTarefas(true);
btRemoverTodas.onclick = () => removerTarefas(false);

