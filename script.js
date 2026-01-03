console.log("lets write java script")
let currentSong = new Audio();
async function getSongs() {
    let a = await fetch('http://127.0.0.1:3000/assets/songs/')
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("songs%5C")[1])
        }
    }

    return songs
}

const playMusic = (track) => {
    // let audio = new Audio("/assets/songs/" + track)
    currentSong.src = "/assets/songs/" + track
    currentSong.play()
}

async function main() {

    //Get the list of all songs
    let songs = await getSongs()

    //Show all the songs on playlist
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> <span class="info">${song} </span> <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="currentColor" />
            </svg></span></li>`
    }

    // Attach an event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        console.log(e.querySelector(".info").innerHTML)
        playMusic(e.querySelector(".info").innerHTML)

    })

    // Attach an evant listner to play, previous and next
    play.addEventListner("click", ()=>{
        if
    })
}

main()