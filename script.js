// Datos en memoria
let usuarios = [
    { id: 1, nombre: "paciente1", tipo: "Paciente" },
    { id: 2, nombre: "admin1", tipo: "Admin" }
];

let medicos = [
    { id: 1, nombre: "Dr. Pérez", especialidad: "Cardiología" },
    { id: 2, nombre: "Dra. Gómez", especialidad: "Pediatría" },
    { id: 3, nombre: "Dr. López", especialidad: "Dermatología" },
    { id: 4, nombre: "Dra. Martínez", especialidad: "Oftalmología" },
    { id: 5, nombre: "Dr. Ramírez", especialidad: "Ortopedia" }
];

let citas = [];

// Función para iniciar sesión
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const user = usuarios.find(u => u.nombre === username);
    if (user) {
        if (user.tipo === "Paciente") {
            window.location.href = "paciente.html";
        } else if (user.tipo === "Admin") {
            window.location.href = "admin.html";
        }
    } else {
        alert("Usuario no encontrado");
    }
});

// Función para cargar médicos en los formularios
function cargarMedicos() {
    const selectMedico = document.getElementById("medico");
    const selectMedicoAdmin = document.getElementById("medicoAdmin");
    if (selectMedico || selectMedicoAdmin) {
        medicos.forEach(medico => {
            const option = document.createElement("option");
            option.value = medico.id;
            option.textContent = `${medico.nombre} - ${medico.especialidad}`;
            if (selectMedico) selectMedico.appendChild(option);
            if (selectMedicoAdmin) selectMedicoAdmin.appendChild(option);
        });
    }
}

// Función para cargar pacientes en el formulario del administrador
function cargarPacientes() {
    const selectPaciente = document.getElementById("paciente");
    if (selectPaciente) {
        usuarios.filter(u => u.tipo === "Paciente").forEach(paciente => {
            const option = document.createElement("option");
            option.value = paciente.id;
            option.textContent = paciente.nombre;
            selectPaciente.appendChild(option);
        });
    }
}

// Función para agendar cita (paciente)
document.getElementById("agendarCitaForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const medicoId = parseInt(document.getElementById("medico").value);
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    // Validar si la cita ya existe
    const citaExistente = citas.find(c => c.fecha === fecha && c.hora === hora && c.medicoId === medicoId);
    if (citaExistente) {
        alert("El horario seleccionado ya está ocupado.");
        return;
    }

    const nuevaCita = {
        id: citas.length + 1,
        usuarioId: 1, // ID del paciente (simulado)
        medicoId: medicoId,
        fecha: fecha,
        hora: hora,
        estado: "Confirmada"
    };

    citas.push(nuevaCita);
    alert("Cita agendada correctamente");
    cargarCitasPaciente();
});

// Función para agendar cita (administrador)
document.getElementById("agendarCitaAdminForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const pacienteId = parseInt(document.getElementById("paciente").value);
    const medicoId = parseInt(document.getElementById("medicoAdmin").value);
    const fecha = document.getElementById("fechaAdmin").value;
    const hora = document.getElementById("horaAdmin").value;

    // Validar si la cita ya existe
    const citaExistente = citas.find(c => c.fecha === fecha && c.hora === hora && c.medicoId === medicoId);
    if (citaExistente) {
        alert("El horario seleccionado ya está ocupado.");
        return;
    }

    const nuevaCita = {
        id: citas.length + 1,
        usuarioId: pacienteId,
        medicoId: medicoId,
        fecha: fecha,
        hora: hora,
        estado: "Confirmada"
    };

    citas.push(nuevaCita);
    alert("Cita agendada correctamente");
    cargarTodasCitas();
});

// Función para cargar citas del paciente
function cargarCitasPaciente() {
    const listaCitas = document.getElementById("listaCitas");
    if (listaCitas) {
        listaCitas.innerHTML = "";
        const citasPaciente = citas.filter(c => c.usuarioId === 1);
        citasPaciente.forEach(cita => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>Médico: ${medicos.find(m => m.id === cita.medicoId).nombre}, Fecha: ${cita.fecha}, Hora: ${cita.hora}</span>
                <button onclick="editarCita(${cita.id})">Editar</button>
                <button onclick="cancelarCita(${cita.id})">Cancelar</button>
            `;
            listaCitas.appendChild(li);
        });
    }
}

// Función para cargar todas las citas (administrador)
function cargarTodasCitas() {
    const listaTodasCitas = document.getElementById("listaTodasCitas");
    if (listaTodasCitas) {
        listaTodasCitas.innerHTML = "";
        citas.forEach(cita => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>Paciente: ${usuarios.find(u => u.id === cita.usuarioId).nombre}, Médico: ${medicos.find(m => m.id === cita.medicoId).nombre}, Fecha: ${cita.fecha}, Hora: ${cita.hora}</span>
                <button onclick="editarCita(${cita.id})">Editar</button>
                <button onclick="cancelarCita(${cita.id})">Cancelar</button>
            `;
            listaTodasCitas.appendChild(li);
        });
    }
}

// Función para editar una cita
function editarCita(id) {
    const cita = citas.find(c => c.id === id);
    if (cita) {
        const nuevaFecha = prompt("Ingrese la nueva fecha (YYYY-MM-DD):", cita.fecha);
        const nuevaHora = prompt("Ingrese la nueva hora (HH:MM):", cita.hora);

        if (nuevaFecha && nuevaHora) {
            // Validar si el nuevo horario está disponible
            const citaExistente = citas.find(c => c.fecha === nuevaFecha && c.hora === nuevaHora && c.medicoId === cita.medicoId);
            if (citaExistente && citaExistente.id !== cita.id) {
                alert("El nuevo horario ya está ocupado.");
                return;
            }

            cita.fecha = nuevaFecha;
            cita.hora = nuevaHora;
            alert("Cita actualizada correctamente");
            if (window.location.pathname.endsWith("paciente.html")) {
                cargarCitasPaciente();
            } else if (window.location.pathname.endsWith("admin.html")) {
                cargarTodasCitas();
            }
        }
    }
}

// Función para cancelar una cita
function cancelarCita(id) {
    const cita = citas.find(c => c.id === id);
    if (cita) {
        cita.estado = "Cancelada";
        alert("Cita cancelada correctamente");
        if (window.location.pathname.endsWith("paciente.html")) {
            cargarCitasPaciente();
        } else if (window.location.pathname.endsWith("admin.html")) {
            cargarTodasCitas();
        }
    }
}

// Función para exportar citas a PDF
function exportarPDF() {
    const doc = new jsPDF();
    doc.text("Lista de Citas", 10, 10);
    let y = 20;
    citas.forEach(cita => {
        const texto = `Paciente: ${usuarios.find(u => u.id === cita.usuarioId).nombre}, Médico: ${medicos.find(m => m.id === cita.medicoId).nombre}, Fecha: ${cita.fecha}, Hora: ${cita.hora}, Estado: ${cita.estado}`;
        doc.text(texto, 10, y);
        y += 10;
    });
    doc.save("citas.pdf");
}

// Cargar médicos y pacientes al iniciar las páginas correspondientes
if (window.location.pathname.endsWith("paciente.html")) {
    cargarMedicos();
    cargarCitasPaciente();
} else if (window.location.pathname.endsWith("admin.html")) {
    cargarMedicos();
    cargarPacientes();
    cargarTodasCitas();
}

// Animación de partículas (opcional)
const particlesContainer = document.createElement("div");
particlesContainer.classList.add("particles");
document.body.appendChild(particlesContainer);

for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 5 + 3}s`;
    particlesContainer.appendChild(particle);
}