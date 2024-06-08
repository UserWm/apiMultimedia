const cancionesContainer = document.getElementById('canciones-container');
const formulario = document.getElementById('formulario');

formulario.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    const formData = new FormData(formulario);
    const response = await fetch("/musica", {
        method: 'POST',
        body: formData
    });

    // Una vez que se haya guardado la nueva canción, vuelves a cargar los elementos
    // para actualizar la lista de canciones en la página.
    cargarCanciones();
});

// Función para cargar las canciones y mostrarlas en la página
async function cargarCanciones() {
    cancionesContainer.innerHTML = ''; // Limpiar el contenedor de canciones antes de cargar nuevas canciones
    
    try {
        const elements = await getElementes("http://localhost:3000/musica/");
        elements.forEach(e => {
            const { nombre, artista, genero, precio, audio } = e;
            
            const infoContainer=document.createElement('div')
            infoContainer.classList.add('info-cancion')

            const nombreTag=document.createElement('p')
            nombreTag.classList.add('nombre')
            nombreTag.innerText=`nombre: ${nombre}`

            const artistaTag=document.createElement('p')
            artistaTag.classList.add('artista')
            artistaTag.innerText=`artista: ${artista}`

            const generoTag=document.createElement('p')
            generoTag.classList.add('genero')
            generoTag.innerText=`genero: ${genero}`

            const precioTag=document.createElement('p')
            precioTag.classList.add('precio')
            precioTag.innerText=`precio:${precio}`

            const audiotag=document.createElement('audio')
            audiotag.classList.add('audio')
            audiotag.setAttribute('controls', '');
            audiotag.setAttribute('src', `../uploadsMusic/${audio}`); 

            infoContainer.append(nombreTag,artistaTag,generoTag,precioTag,audiotag)
            cancionesContainer.appendChild(infoContainer)
        });
    } catch (error) {
        console.log(error);
    }
}

// Función para obtener los elementos de música
async function getElementes(rutas) {
    try {
        const response = await fetch(rutas);
        const elements = await response.json();
        return elements;
    } catch (err) {
        console.log(`error : ${err}`);
        return null;
    }
}

// Llamar a cargarCanciones al cargar la página para mostrar las canciones existentes
window.onload = cargarCanciones;
