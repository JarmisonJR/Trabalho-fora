from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Banco de dados temporário em memória
dados_usuario = {
    "compromissos": [
        {"id": 1, "hora": "08:00", "titulo": "Rotina Matinal e Café"},
        {"id": 2, "hora": "14:00", "titulo": "Bloco de Foco: Programação"},
    ],
    "tarefas": [
        {"id": 1, "texto": "Estudar estruturas de dados", "concluida": False},
        {"id": 2, "texto": "Atualizar README do portfólio", "concluida": True},
    ],
    "nota_rapida": "Ideias para o jogo de terror: criar o sprite do vigia da floresta com lanterna piscando."
}

@app.route('/')
def index():
    return render_template('index.html')

# API para buscar todos os dados
@app.route('/api/dados', methods=['GET'])
def get_dados():
    return jsonify(dados_usuario)

# API para adicionar compromisso
@app.route('/api/compromissos', methods=['POST'])
def add_compromisso():
    novo = request.json
    novo['id'] = len(dados_usuario['compromissos']) + 1
    dados_usuario['compromissos'].append(novo)
    # Ordena por horário
    dados_usuario['compromissos'].sort(key=lambda x: x['hora'])
    return jsonify(novo), 201

# API para adicionar/atualizar tarefas
@app.route('/api/tarefas', methods=['POST'])
def add_tarefa():
    nova = request.json
    nova['id'] = len(dados_usuario['tarefas']) + 1
    nova['concluida'] = False
    dados_usuario['tarefas'].append(nova)
    return jsonify(nova), 201

# API para salvar a nota rápida instantaneamente
@app.route('/api/nota', methods=['POST'])
def salvar_nota():
    dados_usuario['nota_rapida'] = request.json.get('nota', '')
    return jsonify({"status": "sucesso"})

if __name__ == '__main__':
    app.run(debug=True)
