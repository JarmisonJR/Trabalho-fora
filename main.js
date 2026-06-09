let dados = {
    compromissos: [],
    tarefas: [],
    nota_rapida: "",
    diario: "" // Novo campo adicionado
};

document.addEventListener('DOMContentLoaded', () => {
    // Configura data atual por extenso
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('pt-BR', opcoes);

    // Carregar dados salvos no LocalStorage
    const dadosSalvos = localStorage.getItem('meu_espaco_dados');
    if (dadosSalvos) {
        dados = JSON.parse(dadosSalvos);
    }

    atualizarTela();
    inicializarPlayerMusica();

    // Ouvintes de eventos
    document.getElementById('form-compromisso').addEventListener('submit', salvarCompromisso);
    document.getElementById('form-tarefa').addEventListener('submit', salvarTarefa);

    // Auto-save inteligente com Debounce para Notas e Diário
    configurarAutoSave('scratchpad', 'nota_rapida', 'scratch-status');
    configurarAutoSave('diary-input', 'diario', 'diary-status');
});

function salvarNoNavegador() {
    localStorage.setItem('meu_espaco_dados', JSON.stringify(dados));
}

// Configura o salvamento automático conforme digita
function configurarAutoSave(textareaId, chaveDado, statusId) {
    const textarea = document.getElementById(textareaId);
    const statusText = document.getElementById(statusId);
    let timeout;

    textarea.addEventListener('input', () => {
        statusText.innerText = "Digitando...";
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
            dados[chaveDado] = textarea.value;
            salvarNoNavegador();
            statusText.innerText = "Salvo localmente";
        }, 600);
    });
}

// CONTROLE DO PLAYER DE MÚSICA
function inicializarPlayerMusica() {
    const audio = document.getElementById('bg-audio');
    const select = document.getElementById('ambient-music');
    const btnPlay = document.getElementById('btn-play-music');
    const icone = btnPlay.querySelector('i');

    select.addEventListener('change', () => {
        if (select.value) {
            audio.src = select.value;
            if (icone.classList.contains('fa-pause')) {
                audio.play();
            }
        } else {
            audio.pause();
            icone.className = 'fa-solid fa-play';
        }
    });

    btnPlay.addEventListener('click', () => {
        if (!select.value) {
            alert("Escolha uma música na lista primeiro!");
            return;
        }

        if (audio.paused) {
            audio.play();
            icone.className = 'fa-solid fa-pause';
        } else {
            audio.pause();
            icone.className = 'fa-solid fa-play';
        }
    });
}

function atualizarTela() {
    // Renderizar Horários
    const listaComp = document.getElementById('lista-compromissos');
    listaComp.innerHTML = '';
    dados.compromissos.sort((a, b) => a.hora.localeCompare(b.hora));
    dados.compromissos.forEach((c, index) => {
        listaComp.innerHTML += `
            <div class="card">
                <span class="time-tag">${c.hora}</span>
                <span style="flex: 1;">${c.titulo}</span>
                <i class="fa-solid fa-trash-can" style="color: #7a7a9a; cursor: pointer;" onclick="deletarCompromisso(${index})"></i>
            </div>
        `;
    });

    // Renderizar Tarefas
    const listaTar = document.getElementById('lista-tarefas');
    listaTar.innerHTML = '';
    dados.tarefas.forEach((t, index) => {
        listaTar.innerHTML += `
            <div class="card">
                <input type="checkbox" ${t.concluida ? 'checked' : ''} onclick="alternarTarefa(${index})">
                <span style="flex: 1; ${t.concluida ? 'text-decoration: line-through; color: #7a7a9a;' : ''}">${t.texto}</span>
                <i class="fa-solid fa-trash-can" style="color: #7a7a9a; cursor: pointer;" onclick="deletarTarefa(${index})"></i>
            </div>
        `;
    });

    // Inserir Textos Salvos
    document.getElementById('scratchpad').value = dados.nota_rapida || "";
    document.getElementById('diary-input').value = dados.diario || "";
}

function salvarCompromisso(e) {
    e.preventDefault();
    const hora = document.getElementById('comp-hora').value;
    const titulo = document.getElementById('comp-titulo').value;

    dados.compromissos.push({ hora, titulo });
    salvarNoNavegador();
    atualizarTela();
    document.getElementById('comp-titulo').value = '';
}

function salvarTarefa(e) {
    e.preventDefault();
    const texto = document.getElementById('tarefa-texto').value;

    dados.tarefas.push({ texto, concluida: false });
    salvarNoNavegador();
    atualizarTela();
    document.getElementById('tarefa-texto').value = '';
}

function alternarTarefa(index) {
    dados.tarefas[index].concluida = !dados.tarefas[index].concluida;
    salvarNoNavegador();
    atualizarTela();
}

function deletarCompromisso(index) {
    dados.compromissos.splice(index, 1);
    salvarNoNavegador();
    atualizarTela();
}

function deletarTarefa(index) {
    dados.tarefas.splice(index, 1);
    salvarNoNavegador();
    atualizarTela();
}
