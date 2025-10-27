// Funcionalidad del dashboard del docente
window.onload = function() {
    // Mostrar sección inicial
    showSection('inicio');
    loadEvaluations();
    loadTeacherResources();
}

// Función para cerrar sesión
function logout() {
    localStorage.clear(); // Limpiar todos los datos de sesión
    window.location.href = 'index.html';
}

// Exponer función logout globalmente
window.logout = logout;

// Mostrar/ocultar secciones y manejar estado activo del menú
function showSection(sectionId) {
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    document.querySelectorAll('.sidebar li').forEach(item => {
        item.classList.remove('active');
    });

    const selected = document.getElementById(sectionId + '-section');
    if (selected) selected.style.display = 'block';

    const menuItem = document.getElementById('menu-' + sectionId);
    if (menuItem) menuItem.classList.add('active');
}

// Helpers / Handlers
function goToEvaluations() {
    showSection('evaluaciones');
}

function startGrading(evaluationName) {
    // En una app real aquí se redirigiría a la interfaz de calificación.
    alert('Abrir panel de calificación para: ' + evaluationName);
}

function viewStudentReport(studentName) {
    alert('Mostrando reporte rápido de ' + studentName);
}

function sendFeedback() {
    const student = document.getElementById('fb-student').value;
    const text = document.getElementById('fb-text').value.trim();
    if (!text) {
        alert('Escribe un mensaje antes de enviar.');
        return;
    }

    // Simular envío: guardar en localStorage como historial de feedback del docente
    const key = 'feedback_history_' + student.replace(/\s+/g, '_');
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift({ date: new Date().toLocaleDateString('es-ES'), text });
    localStorage.setItem(key, JSON.stringify(existing));

    document.getElementById('fb-text').value = '';
    alert('Retroalimentación enviada a ' + student + '. (Simulado)');
}

function previewFeedback() {
    const student = document.getElementById('fb-student').value;
    const text = document.getElementById('fb-text').value.trim();
    if (!text) { alert('Escribe un mensaje para previsualizar.'); return; }
    const preview = `Previsualizar para ${student}:\n\n${text}`;
    // Usamos alert como previsualización ligera; se puede cambiar por modal más adelante
    alert(preview);
}

// Exponer funciones globalmente para los onclick inline
window.showSection = showSection;
window.goToEvaluations = goToEvaluations;
window.startGrading = startGrading;
window.viewStudentReport = viewStudentReport;
window.sendFeedback = sendFeedback;

// --- Gestión de evaluaciones (local) ---
// Funciones para manejar preguntas y opciones
function addQuestion() {
    const template = document.getElementById('question-template');
    const container = document.getElementById('questions-list');
    const clone = template.content.cloneNode(true);
    
    // Asignar un ID único a la nueva pregunta
    const questionCard = clone.querySelector('.question-card');
    const questionId = `question_${Date.now()}`;
    questionCard.dataset.questionId = questionId;
    
    container.appendChild(clone);
}

function removeQuestion(button) {
    button.closest('.question-card').remove();
}

function addOption(button) {
    const template = document.getElementById('option-template');
    const container = button.previousElementSibling; // options-list
    const clone = template.content.cloneNode(true);
    
    // Asignar un nombre único al grupo de radio buttons de esta pregunta
    const questionCard = button.closest('.question-card');
    const questionId = questionCard.dataset.questionId || `question_${Date.now()}`;
    questionCard.dataset.questionId = questionId;
    
    // Asignar el nombre del grupo al nuevo radio button
    const radioButton = clone.querySelector('.option-correct');
    radioButton.name = `correct_${questionId}`;
    
    container.appendChild(clone);
}

function removeOption(button) {
    const optionItem = button.closest('.option-item');
    const isChecked = optionItem.querySelector('.option-correct').checked;
    optionItem.remove();
    
    // Si eliminamos la opción marcada como correcta, debemos asegurarnos de que haya otra opción seleccionada
    if (isChecked) {
        const questionCard = button.closest('.question-card');
        const firstOption = questionCard.querySelector('.option-correct');
        if (firstOption) {
            firstOption.checked = true;
        }
    }
}

function createEvaluation() {
    const title = document.getElementById('eval-title').value.trim();
    const desc = document.getElementById('eval-desc').value.trim();
    const due = document.getElementById('eval-due').value;
    const type = document.getElementById('eval-type').value;

    if (!title || !due || !type) {
        alert('Por favor completa los campos obligatorios (título, fecha y tipo).');
        return;
    }

    // Validar que haya al menos una pregunta
    const questionCards = document.querySelectorAll('.question-card');
    if (questionCards.length === 0) {
        alert('Debes agregar al menos una pregunta.');
        return;
    }

    // Recolectar preguntas y sus opciones
    const questions = [];
    document.querySelectorAll('.question-card').forEach(card => {
        const questionText = card.querySelector('.question-text').value.trim();
        if (!questionText) return; // Ignorar preguntas vacías

        const options = [];
        card.querySelectorAll('.option-item').forEach(item => {
            const optionText = item.querySelector('.option-text').value.trim();
            const isCorrect = item.querySelector('.option-correct').checked;
            if (optionText) {
                options.push({ text: optionText, isCorrect });
            }
        });

        if (options.length > 0) {
            questions.push({
                text: questionText,
                options
            });
        }
    });

    if (questions.length === 0) {
        alert('Agrega al menos una pregunta con opciones.');
        return;
    }

    // Validar que cada pregunta tenga al menos una respuesta correcta
    const invalid = questions.some(q => !q.options.some(o => o.isCorrect));
    if (invalid) {
        alert('Cada pregunta debe tener al menos una respuesta correcta marcada.');
        return;
    }

    const key = 'docente_evaluations';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const newEval = { 
        id: Date.now(), 
        title, 
        desc, 
        due, 
        type,
        questions
    };
    existing.unshift(newEval);
    localStorage.setItem(key, JSON.stringify(existing));

    // Limpiar formulario
    document.getElementById('eval-title').value = '';
    document.getElementById('eval-desc').value = '';
    document.getElementById('eval-due').value = '';
    document.getElementById('eval-type').value = '';
    document.getElementById('questions-list').innerHTML = '';

    loadEvaluations();
    alert('Evaluación creada exitosamente.');
}

function previewEvaluation() {
    const title = document.getElementById('eval-title').value.trim();
    const desc = document.getElementById('eval-desc').value.trim();
    const due = document.getElementById('eval-due').value;
    const type = document.getElementById('eval-type').value;

    let preview = `PREVISUALIZACIÓN\n\n${title}\n`;
    if (desc) preview += `${desc}\n`;
    preview += `Fecha límite: ${due}\nTipo: ${type}\n\nPreguntas:\n`;

    document.querySelectorAll('.question-card').forEach((card, i) => {
        const questionText = card.querySelector('.question-text').value.trim();
        if (!questionText) return;

        preview += `\n${i + 1}. ${questionText}\n`;
        card.querySelectorAll('.option-item').forEach((item, j) => {
            const optionText = item.querySelector('.option-text').value.trim();
            const isCorrect = item.querySelector('.option-correct').checked;
            if (optionText) {
                preview += `   ${String.fromCharCode(97 + j)}) ${optionText}${isCorrect ? ' ✓' : ''}\n`;
            }
        });
    });

    alert(preview);
}

function loadEvaluations() {
    const listEl = document.getElementById('evaluations-list');
    if (!listEl) return;
    const existing = JSON.parse(localStorage.getItem('docente_evaluations') || '[]');
    if (existing.length === 0) {
        listEl.innerHTML = '<p style="color:#64748b;">No hay evaluaciones creadas.</p>';
        return;
    }

    listEl.innerHTML = '';
    existing.forEach(ev => {
        const item = document.createElement('div');
        item.className = 'eval-item';
        
        // Contar preguntas y respuestas correctas
        const questionCount = ev.questions ? ev.questions.length : 0;
        const correctAnswers = ev.questions ? ev.questions.reduce((total, q) => 
            total + q.options.filter(o => o.isCorrect).length, 0) : 0;

        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:start; gap:1rem;">
              <div style="flex:1;">
                <strong>${ev.title}</strong>
                <div style="color:#64748b; font-size:0.9rem;">${ev.desc || ''}</div>
                <div style="color:#64748b; font-size:0.85rem; margin-top:0.25rem;">
                    Tipo: ${ev.type || 'No especificado'} • Vence: ${ev.due || '—'}<br>
                    Preguntas: ${questionCount} • Respuestas correctas totales: ${correctAnswers}
                </div>
                
                <div class="evaluation-details" style="display:none; margin-top:0.75rem;">
                    ${ev.questions ? ev.questions.map((q, i) => `
                        <div class="question-preview" style="margin-top:0.5rem;">
                            <div style="font-weight:500;">${i + 1}. ${q.text}</div>
                            <div style="margin-left:1rem; margin-top:0.25rem;">
                                ${q.options.map((o, j) => `
                                    <div style="color:${o.isCorrect ? '#059669' : '#64748b'}; display:flex; align-items:center; gap:0.25rem;">
                                        ${String.fromCharCode(97 + j)}) ${o.text} ${o.isCorrect ? '✓' : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:0.5rem;">
                <button class="start-activity-btn" onclick="startGrading('${escapeForAttr(ev.title)}')">Calificar</button>
                <button class="review-activity-btn" onclick="toggleDetails(this)">Ver detalles</button>
                <button class="review-activity-btn" onclick="removeEvaluation(${ev.id})">Eliminar</button>
              </div>
            </div>
        `;
        listEl.appendChild(item);
    });
}

// Función auxiliar para mostrar/ocultar detalles de la evaluación
function toggleDetails(button) {
    const details = button.closest('.eval-item').querySelector('.evaluation-details');
    const isHidden = details.style.display === 'none';
    details.style.display = isHidden ? 'block' : 'none';
    button.textContent = isHidden ? 'Ocultar detalles' : 'Ver detalles';
}

function removeEvaluation(id) {
    const existing = JSON.parse(localStorage.getItem('docente_evaluations') || '[]');
    const filtered = existing.filter(e => e.id !== id);
    localStorage.setItem('docente_evaluations', JSON.stringify(filtered));
    loadEvaluations();
}

function escapeForAttr(str) {
    return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// --- Gestión de recursos compartidos por el docente ---
function addResource() {
        const title = document.getElementById('res-title').value.trim();
        const link = document.getElementById('res-link').value.trim();
        const desc = document.getElementById('res-desc').value.trim();
        const area = document.getElementById('res-area').value;
        if (!title || !link) { alert('Título y enlace son obligatorios.'); return; }

        const key = 'shared_resources';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const newRes = { id: Date.now(), title, link, desc, area, date: new Date().toLocaleDateString('es-ES') };
        existing.unshift(newRes);
        localStorage.setItem(key, JSON.stringify(existing));

        // limpiar
        document.getElementById('res-title').value = '';
        document.getElementById('res-link').value = '';
        document.getElementById('res-desc').value = '';

        loadTeacherResources();
        alert('Recurso agregado y publicado para estudiantes (simulado).');
}

function loadTeacherResources() {
        const listEl = document.getElementById('teacher-resources-list');
        if (!listEl) return;
        const existing = JSON.parse(localStorage.getItem('shared_resources') || '[]');
        if (existing.length === 0) { listEl.innerHTML = '<p style="color:#64748b;">No hay recursos compartidos.</p>'; return; }
        listEl.innerHTML = '';
        existing.forEach(r => {
                const item = document.createElement('div');
                item.className = 'eval-item';
                item.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong>${r.title}</strong>
                            <div style="color:#64748b; font-size:0.9rem;">${r.desc || ''}</div>
                            <div style="color:#64748b; font-size:0.85rem; margin-top:0.25rem;">Área: ${r.area} • ${r.date}</div>
                        </div>
                        <div style="display:flex; gap:0.5rem;">
                            <a class="resource-link" href="${r.link}" target="_blank">Abrir</a>
                            <button class="review-activity-btn" onclick="removeResource(${r.id})">Eliminar</button>
                        </div>
                    </div>
                `;
                listEl.appendChild(item);
        });
}

function removeResource(id) {
        const existing = JSON.parse(localStorage.getItem('shared_resources') || '[]');
        const filtered = existing.filter(r => r.id !== id);
        localStorage.setItem('shared_resources', JSON.stringify(filtered));
        loadTeacherResources();
}
