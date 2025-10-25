// Funcionalidad del dashboard del docente
window.onload = function() {
    // Mostrar sección inicial
    showSection('inicio');
    loadEvaluations();
    loadTeacherResources();
}

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
function createEvaluation() {
    const title = document.getElementById('eval-title').value.trim();
    const desc = document.getElementById('eval-desc').value.trim();
    const due = document.getElementById('eval-due').value;
    const questions = parseInt(document.getElementById('eval-questions').value, 10) || 0;

    if (!title) { alert('El título es obligatorio.'); return; }

    const key = 'docente_evaluations';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const newEval = { id: Date.now(), title, desc, due, questions };
    existing.unshift(newEval);
    localStorage.setItem(key, JSON.stringify(existing));

    // Limpiar formulario
    document.getElementById('eval-title').value = '';
    document.getElementById('eval-desc').value = '';
    document.getElementById('eval-due').value = '';
    document.getElementById('eval-questions').value = '';

    loadEvaluations();
    alert('Evaluación creada (simulado).');
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
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
              <div>
                <strong>${ev.title}</strong>
                <div style="color:#64748b; font-size:0.9rem;">${ev.desc || ''}</div>
                <div style="color:#64748b; font-size:0.85rem; margin-top:0.25rem;">Vence: ${ev.due || '—'} • Preguntas: ${ev.questions || 0}</div>
              </div>
              <div style="display:flex; gap:0.5rem;">
                <button class="start-activity-btn" onclick="startGrading('${escapeForAttr(ev.title)}')">Calificar</button>
                <button class="review-activity-btn" onclick="removeEvaluation(${ev.id})">Eliminar</button>
              </div>
            </div>
        `;
        listEl.appendChild(item);
    });
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
