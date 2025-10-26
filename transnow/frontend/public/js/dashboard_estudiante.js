// Mostrar el nombre del estudiante y configurar vista inicial
window.onload = function() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        const username = userEmail.split('@')[0];
        document.getElementById('studentName').textContent = username;
    }
    
    // Mostrar sección inicial
    showSection('inicio');
}

// Función para cerrar sesión
function logout() {
    localStorage.clear(); // Limpiar todos los datos de sesión
    window.location.href = 'index.html';
}

// Exponer función logout globalmente
window.logout = logout;

// Función para mostrar las diferentes secciones
function showSection(sectionId) {
    // Ocultar todas las secciones primero
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    
    // Remover clase active de todos los elementos del menú
    document.querySelectorAll('.sidebar li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(sectionId + '-section');
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Activar el elemento del menú correspondiente
    const menuItem = document.getElementById('menu-' + sectionId);
    if (menuItem) {
        menuItem.classList.add('active');
    }
}