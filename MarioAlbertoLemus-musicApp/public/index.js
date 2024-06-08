const root = document.getElementById('root')
const songList = document.createElement('section')
const BASE_ENDPOINT = '/api/tracks'

songList.classList.add('song__list')

fetch(`${BASE_ENDPOINT}`)
.then(data => data.json())
.then(res => {
    root.appendChild(songList)
    res.forEach(currtrack => {
        const songContainer = document.createElement('div')
        songContainer.classList.add('song__container')
        songContainer.innerHTML = `
            <div class='song__info'>
                <div class='song__price'>
                    <p>$${currtrack.price}</p>
                </div>
                <div>
                    <h3>${currtrack.songName}</h3>
                    <div class='song__artist__genre'>
                        <p>${currtrack.artist}</p>
                        <p>/</p>
                        <p>${currtrack.genre}</p>
                    </div>
                </div>
            </div>
            <div class='audio__container'>
                <audio id="audioPlayer" controls>
                <source src="uploads/tracks/${currtrack.song}" type="audio/mpeg">
                </audio>
            </div>
            </br>
        `
        songList.appendChild(songContainer)
    });
})
