document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api/music'; 
    const UPLOADS_URL = 'http://localhost:3000/uploads';
    const songForm = document.getElementById('songForm');
    const songList = document.getElementById('songList');

    async function fetchSongs() {
        const response = await fetch(API_URL);
        const songs = await response.json();
        songList.innerHTML = '';
        songs.forEach(song => {
            const li = document.createElement('li');
            li.innerHTML = `
                <h2>${song.nombre}</h2>
                <p>Artista: ${song.artista}</p>
                <p>Género: ${song.genero}</p>
                <p>Precio: $${song.precio}</p>
                <audio controls>
                    <source src="${UPLOADS_URL}/${song.audio}" type="audio/mpeg">
                </audio>
                <button class="delete" data-id="${song._id}">Eliminar</button>
            `;
            songList.appendChild(li);
        });
    }

    songForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(songForm);
        await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        songForm.reset();
        fetchSongs();
    });

    songList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.getAttribute('data-id');
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            fetchSongs();
        }
    });

    fetchSongs();
});
