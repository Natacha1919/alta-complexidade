document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('altaEvaluationForm');
    const N1Container = document.getElementById('N1-criteria');
    const N2Container = document.getElementById('N2-criteria');
    const N3Container = document.getElementById('N3-criteria');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submitBtn');

    // ** CONFIGURAÇÃO **
    // Use o mesmo URL do seu Web App
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyNJBrMKWVQVdQB3Bi2wSz2lixIZfY74KEnw7S9WrEBWlFJjcc6Jx9fWX_Wfg6Q08_72g/exec'; 

    // Dados dos critérios baseados no PDF (Simplificados para atribuição de NOTA 0-10)
    const criteria = {
        N1: [ // 8 Itens no total [cite: 46]
            "Conhecimento do processo de trabalho do setor e protocolos (Segurança, Infecções, Gestão de risco)",
            "Protocolos de atuação do Enfermeiro",
            "Relacionar teoria e prática, manter-se atualizado?",
            "Conhecer os processos administrativos (planejamento, organização, gestão, direção e controle)",
            "Conhecimento equipamentos e instrumentos de trabalho",
            "Conhecimento do processo de Enfermagem relacionado com os problemas do paciente/cliente",
            "Políticas de humanização preconizada pelo Sistema Único de Saúde - SUS",
            "Aplica a SAE (NANDA, NIC e NOC) [cite: 46]"
        ],
        N2: [ // 9 Itens no total 
            "Comportamento ético, respeito, compromisso, equidade, dignidade, competência, responsabilidade",
            "Segue as orientações? Interação com preceptor de estágio",
            "Apresenta espírito de liderança, criatividade?",
            "Flexibilidade e resiliência",
            "Aparência pessoal, uso do uniforme, crachá, cumprimento da NR32",
            "Apresenta proatividade? Possui interesse em aprimorar conhecimentos?",
            "Assiduidade e Pontualidade",
            "Trabalha sob pressão? Propõe resolução de problemas? ",
            "Apresenta bom relacionamento Interpessoal? Possui estabilidade emocional? Comunicação verbal/ não verbal: paciente/familia/equipe de trabalho/professor/colegas "
        ],
        N3: [ // 10 Itens no total [cite: 49]
            "Práticas são baseadas em evidências? ",
            "Aplicação da avaliação clínica dos pacientes, identificação de prioridades ",
            "Possui organização e gestão do tempo? Organiza a unidade de trabalho? ",
            "Gestão de custos para assistência de enfermagem ",
            "Tomada de decisão/negociação/gestão de conflitos ",
            "Elaboração e planejamento do cuidado ",
            "Raciocínio clínico ",
            "Capacidade de agir com rapidez, eficiência e eficácia ",
            "Reconhece-se no papel do enfermeiro ",
            "Qualidade do trabalho executado "
        ]
    };

    /**
     * Gera a estrutura HTML para cada seção de notas (N1, N2, N3).
     * @param {Array<string>} list - Lista de descrições dos critérios.
     * @param {string} sectionId - O ID da seção (N1, N2, N3).
     */
    function renderCriteria(list, sectionId) {
      return list.map((description, index) => {
        const inputId = `${sectionId}_item_${index + 1}`;
        // Não precisamos de split se as strings na constante 'criteria' não tiverem as tags
        const cleanDescription = description.trim(); // Apenas trim para limpar espaços

        // CORRIGIDO: Removida a tag <x> e garantido o HTML válido
        return `
            <div class="form-group criteria-group">
                <label for="${inputId}">${cleanDescription}</label> 
                <input type="number" 
                       id="${inputId}"
                       name="${inputId}"
                       required
                       min="0"
                       max="10"
                       step="0.5"
                       placeholder="0 a 10"
                       aria-label="Nota para ${cleanDescription}">
            </div>
        `;
    }).join('');
}

    // Renderiza o HTML dos critérios nas respectivas seções
    N1Container.innerHTML = renderCriteria(criteria.N1, 'N1');
    N2Container.innerHTML = renderCriteria(criteria.N2, 'N2');
    N3Container.innerHTML = renderCriteria(criteria.N3, 'N3');

    /**
     * Exibe uma mensagem de status (sucesso/erro).
     */
    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.classList.remove('hidden');
        formStatus.focus();
        setTimeout(() => formStatus.classList.add('hidden'), 8000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            showStatus('Por favor, preencha todos os campos obrigatórios e corrija as notas inválidas.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        formStatus.classList.add('hidden');

        const formData = new FormData(form);
        const dataToSend = new URLSearchParams(formData);

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: dataToSend, 
            });

            showStatus('Avaliação enviada com sucesso! A nota final será calculada na Planilha.', 'success');
            form.reset();

        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            showStatus('Ocorreu um erro ao conectar-se ao servidor. Tente novamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Avaliação de Alta Complexidade';
        }
    });
});