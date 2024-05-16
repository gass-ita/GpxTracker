const timeLabel = document.getElementById('timeString');
const pulsante = document.getElementById('pulsante');
const latitudeTag = document.getElementById('latitude');
const longitudeTag = document.getElementById('longitude');

let startMode = true; // Impostiamo startMode a true per avviare il timer all'inizio
let timerInterval;
var seconds = 0;
var minutes = 0;
var hours   = 0;
const positionList = [];

function buttonClick() {
    startMode = !startMode;
    // Cambiamo il nome al pulsante
    if (startMode) {
        pulsante.innerHTML = "START";
        clearInterval(timerInterval);
        reset();
    } else {
        pulsante.innerHTML = "STOP";
        timerInterval = setInterval(startTime, 1000); // Aggiorniamo il tempo ogni secondo
    }
}


function startTime() {
    //TimeFormat
    seconds += 1;
    minutes = parseInt(seconds / 60);
    hours   = parseInt(minutes / 60);
    const timeString = `${hours}:${minutes % 60}:${seconds % 60}`;
    timeLabel.innerHTML = timeString;


    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
        

        // Update HTML elements with the coordinates and altitude
            latitudeTag.innerHTML = latitude;
            longitudeTag.innerHTML = longitude;

            positionList.push([latitude, longitude])
        });
    }
    
}

function reset(){
    sendPositionListToServer();

    seconds = 0
    minutes = 0
    hours   = 0
    const timeString = `${hours}:${minutes % 60}:${seconds % 60}`;
    timeLabel.innerHTML = timeString;

    latitudeTag.innerHTML = '';
    longitudeTag.innerHTML = '';



}

function sendPositionListToServer() {
    console.log(positionList);
    // Converti la lista in formato JSON
    const jsonData = JSON.stringify(positionList);
    console.log(jsonData);

    // Imposta le opzioni della richiesta
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    };

    // Esegui la richiesta POST al fastAPI
    fetch('http://127.0.0.1:8000/upload', requestOptions) // Correzione: aggiungi il protocollo
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nella richiesta al server');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dati ricevuti dal server:', data);
        })
        .catch(error => {
            console.error('Errore durante la richiesta al server:', error);
        });
}
