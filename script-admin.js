
let currentQuestion = 1, totalQuestions = 0, correctAnswers = [];

function createRoom() {
    totalQuestions = parseInt(document.getElementById('num_questions').value);
    correctAnswers = [];
    document.getElementById('question_controls').style.display = 'block';
}

function startRound() {
    const correct = document.getElementById('correct_answer').value.toUpperCase();
    correctAnswers.push(correct);
    const ref = db.ref('quiz/current');
    ref.set({
        question: currentQuestion,
        correct: correct,
        active: true
    });
    db.ref('quiz/responses').remove();
    document.getElementById('current_question').textContent = currentQuestion;
    setTimeout(() => {
        ref.update({ active: false });
        db.ref('quiz/responses').once('value', snapshot => {
            const scores = {};
            snapshot.forEach(child => {
                const { name, answer, time } = child.val();
                if (answer === correct) {
                    let points = 0;
                    if (time < 5) points = 20;
                    else if (time < 10) points = 15;
                    else if (time < 15) points = 10;
                    else if (time < 20) points = 5;
                    scores[name] = { points, time };
                }
            });
            const roundList = document.getElementById('round_scores');
            const totalList = document.getElementById('total_scores');
            roundList.innerHTML = ''; totalList.innerHTML = '';
            for (let name in scores) {
                const li = document.createElement('li');
                li.textContent = `${name}: ${scores[name].points} punti`;
                roundList.appendChild(li);
                db.ref(`quiz/total/${name}`).once('value').then(snap => {
                    const total = (snap.val() || 0) + scores[name].points;
                    db.ref(`quiz/total/${name}`).set(total);
                    const liTotal = document.createElement('li');
                    liTotal.textContent = `${name}: ${total} punti totali`;
                    totalList.appendChild(liTotal);
                });
            }
        });
    }, 10000);
    currentQuestion++;
}
