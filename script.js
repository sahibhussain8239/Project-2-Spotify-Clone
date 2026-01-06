let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinsec(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currfolder = folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let songTrim1 = element.href.replaceAll("%5C", "/")
            let songTrim2 = songTrim1.replaceAll("//", "/")
            let songTrim3 = songTrim2.replace("http:/127.0.0.1:3000", "")
            songs.push(songTrim3.split(`/${folder}`)[1])
        }
    }

    //Show all the songs on playlist
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> <div class="info">${song}</div> <div><img style="filter: invert();" src="assets/img/circlePlay.svg" alt=""></div></li>`
    }

    // Attach an event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").innerHTML)
        })

    })
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `${currfolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "/assets/img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00/00"
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("Csongs")) {
            let folder = e.href.split("%5C").slice(-2)[1]
            // Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}info.json`)
            let response = await a.json()
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                    <div class="play"><img src="assets/img/play.svg" alt=""></div>
                    <img src="/songs/${folder}cover.jpg" alt="">
                    <div class="card-content">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>
                </div>`
        }
    }
    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
    
}


async function main() {

    //Get the list of all songs
    await getSongs("songs/play1/")

    // Display all the albums on the page
    displayAlbums()

    // Attach an evant listner to play
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "/assets/img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "/assets/img/playbtn.svg"
        }
    })

    // Listen for timeupdate
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinsec(currentSong.currentTime)}:${secondsToMinsec(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // ADD an event listner in seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // Add an evant listner to previous and next
    previous.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // To show and hide volume range on click on volume icon
    document.querySelector(".volbtn").addEventListener("click", () => {
        document.querySelector(".range").classList.toggle("showrange")
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })


}

main()