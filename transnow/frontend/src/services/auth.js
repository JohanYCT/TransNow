// Función para manejar el inicio de sesión
async function login(email, password) {
    try {
        const response = await fetch('http://localhost:8000/api/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Credenciales inválidas');
        }

        const data = await response.json();
        
        // Guardar el token y el rol en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userId', data.user_id);
        
        return data;
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        throw error;
    }
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Función para obtener el rol del usuario
function getUserRole() {
    return localStorage.getItem('userRole');
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    window.location.href = '/index.html';
}