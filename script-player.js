
let playerName = "", room = "";

function joinRoom() {
    room = document.getElementById('room_code').value;
    playerName = document.getElementById('player_name').value;
    document.getElementById('join_section').style.display = 'none';
    document.getElementById('quiz_section').style.display = 'block';
    db.ref('quiz/current').on('value', snapshot => {
        const data = snapshot.val();
        if (data && data.active) {
            document.querySelectorAll('button').forEach(btn => btn.disabled = false);
        }
    });
}

function sendAnswer(answer) {
    const timestamp = Date.now();
    db.ref('quiz/current').once('value').then(snap => {
        const startTime = snap.val().timestamp || timestamp;
        const timeTaken = (timestamp - startTime) / 1000;
        db.ref(`quiz/responses/${playerName}`).set({
            name: playerName,
            answer: answer,
            time: timeTaken
        });
        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
    });
}

function exitRoom() {
    location.reload();
}
