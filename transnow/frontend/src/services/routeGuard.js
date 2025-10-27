// Protección de rutas
function checkAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    const currentPath = window.location.pathname;
    const userRole = getUserRole();

    // Redirigir si el usuario intenta acceder a una página que no corresponde a su rol
    if (currentPath.includes('docente') && userRole !== 'docente') {
        window.location.href = '/select_rol.html';
    } else if (currentPath.includes('estudiante') && userRole !== 'estudiante') {
        window.location.href = '/select_rol.html';
    }
}

// Verificar autenticación al cargar cada página
document.addEventListener('DOMContentLoaded', checkAuth);