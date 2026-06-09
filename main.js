document.addEventListener('DOMContentLoaded', () => {
    // Exibir data atual por extenso
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('pt-BR', opcoes);

    // Carregar dados iniciais do servidor
    carregarDados();

    // Eventos dos formulários
    document.getElementById('form-compromisso').addEventListener('submit', adicioneCompromisso);
    document.getElementById('form-tarefa').addEventListener('submit', adicionarTarefa);

    // Evento de digitação no Bloco de Notas (com auto-save temporizado)
    let timeoutSalvar;
    const scratchpad = document.getElementById('scratchpad');
    const statusText = document.getElementById('status-salvamento');

    scratchpad.addEventListener('input', () => {
        statusText.innerText = "Digitando...";
        clearTimeout(timeoutSalvar);
        timeoutSalvar = setTimeout(() => {
            statusText.innerText = "Salvando...";
            fetch('/api/nota', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nota: scratchpad.value })
            })
            .then(res => res.json())
            .then(() => statusText.innerText = "Alterações salvas!")
            .catch(() => statusText.innerText = "Erro ao salvar automaticamente.");
        }, 1000); // Salva 1 segundo após o usuário parar de digitar
    });
});

async function carregarDados() {
    try {
        const response = await fetch('/api/dados');
        const dados = await response.json();
        
        // Renderizar compromissos
        const listaComp = document.getElementById('lista-compromissos');
        listaComp.innerHTML = '';
        dados.compromissos.forEach(c => {
            listaComp.innerHTML += `
                <div class="card">
                    <span class="time-tag">${c.hora}</span>
                    <span>${c.titulo}</span>
                </div>
            `;
        });

        // Renderizar tarefas
        const listaTar = document.getElementById('lista-tarefas');
        listaTar.innerHTML = '';
        dados.tarefas.forEach(t => {
            listaTar.innerHTML += `
                <div class="card">
                    <input type="checkbox" ${t.concluida ? 'checked' : ''} disabled>
                    <span style="${t.concluida ? 'text-decoration: line-through; color: #8d8d99;' : ''}">${t.texto}</span>
                </div>
            `;
        });

        // Preencher bloco de notas
        document.getElementById('scratchpad').value = dados.nota_rapida;

    } catch (error) {
        console.error("Erro ao buscar dados do servidor:", error);
    }
}

async function adicioneCompromisso(e) {
    e.preventDefault();
    const hora = document.getElementById('comp-hora').value;
    const titulo = document.getElementById('comp-titulo').value;

    await fetch('/api/compromissos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hora, titulo })
    });

    document.getElementById('comp-titulo').value = '';
    carregarDados();
}

async function adicionarTarefa(e) {
    e.preventDefault();
    const texto = document.getElementById('tarefa-texto').value;

    await fetch('/api/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto })
    });

    document.getElementById('tarefa-texto').value = '';
    carregarDados();
}
