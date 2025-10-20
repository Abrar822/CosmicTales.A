let quizContainer = document.querySelector('.quizContainer');
let quizBox = document.querySelector('.quizBox');
let initialContent = document.querySelector('.initialContent');
let handlingbar = document.querySelector('.handlingbar');
// buttons
let startBtn = document.querySelector('.start');
let backBtn = document.querySelector('.back');
let nextBtn = document.querySelector('.next');
// cards items
let qNo = document.querySelector('.qNo');
let question = document.querySelector('.question');
let options = document.querySelector('.options');
// For quiz
let quizLink = 'https://raw.githubusercontent.com/Abrar822/Json.A/refs/heads/main/mcqs_Cosmic_Tales.json';
let data = [], score = 0, count = 0;
// backward mechanism without alteration of the answers
let clickedArr = [];
for (let i = 0; i < 10; i++) {
    clickedArr[i] = false; // initialize all as not clicked
}

let mySet = new Set();
let correctAns = [];
// To fetch the data
async function fetcher() {
    document.querySelector('.loader').style.display = 'flex';
    let response = await fetch(quizLink);
    data = await response.json();
    data = data.questions;
    document.querySelector('.loader').style.display = 'none';
}
// To load question
function loadQuestion(count) {
    let randNum;
    let myQNo = count;
    while(true) {
        randNum = Math.floor(Math.random() * data.length);
        if(!mySet.has(randNum)) {
            mySet.add(randNum);
            break;
        }
    }
    let myQuestion = data[randNum].question;
    correctAns.push(data[randNum].correct_answer);
    let corrAns = data[randNum].correct_answer;
    let myOptions = [data[randNum].correct_answer, ...data[randNum].incorrect_answers].sort(() => Math.random() - 0.5);
    return {myQNo, myQuestion, myOptions, corrAns};
}
// Function that create cards
function createCards(i) {
    let object = loadQuestion(i);
    let myQNo = object.myQNo;
    let myQuestion = object.myQuestion;
    let myOptions = object.myOptions;
    let corrAns = object.corrAns;
    let card = document.createElement('div');
    card.innerHTML = `
    <div class="content">
        <h2 class="quiz">Quiz</h2>
        <div class="quesbar">
            <div class="qNo">${myQNo}</div>
            <div class="question">${myQuestion}</div>
        </div>
        <div class="options">
            <button>${myOptions[0]}</button>
            <button>${myOptions[1]}</button>
            <button>${myOptions[2]}</button>
            <button>${myOptions[3]}</button>
        </div>
    </div>`;
    card.classList.add("card");
    document.querySelector('.cardContainer').append(card);

    let allOptions = card.querySelectorAll('.options button');
    allOptions.forEach((opt) => {
        opt.addEventListener('click', () => {
            clickedArr[myQNo - 1] = true;
            // assessing the response
            if(opt.innerText === corrAns) {
                opt.style.border = '3px solid green';
                score++;
            } else {
                opt.style.border = '3px solid red';
            }
            // For correcting if wrong
            allOptions.forEach((opte) => {
                if(opte.innerText === corrAns) {
                    opte.style.border = '3px solid green';
                }
                opte.disabled = true;
            })
        })
    })
}
// removal of cards
function removeCards() {
    document.querySelectorAll('.card').forEach((card) => {
        card.remove();
    })
}
// For start button
startBtn.addEventListener('click', async () => {
    initialContent.style.display = 'none';
    handlingbar.style.display ='flex';
    document.querySelector('.cardContainer').style.display = 'flex';
    nextBtn.innerText = 'Next';
    score = 0
    count = 0;
    removeCards();
    await fetcher();
    for(let i = 1; i <= 10; i++) {
        createCards(i);
    }
    updateSlider(count);
    // To disable tabs during playing quiz
    document.querySelectorAll('.menu').forEach((m) => {
        m.style.pointerEvents = 'none';
        m.style.color = '#ffffffc0';
    })
})
// For replay button 
let replay = document.querySelector('.scoreBoard .replay');
replay.addEventListener('click', () => {
    score = 0;
    document.querySelector('.scoreBoard').style.display = 'none';
    document.querySelector('.initialContent').style.display = 'flex';
    nextBtn.innerText = 'Next';
})

backBtn.addEventListener('click',() => {
    if(count > 0) {
        --count;
        updateSlider(count);
    }
})
nextBtn.addEventListener('click', () => {
    if(count < 10 && clickedArr[count]) {
        ++count;
        updateSlider(count);
    }
    if(count == 9) nextBtn.innerText = 'Result';
    if(count == 10) {
        document.querySelectorAll('.menu').forEach((m) => {
            m.style.pointerEvents = 'auto';
            m.style.color = '#ffffff';
            handlingbar.style.display = 'none';
            document.querySelector('.cardContainer').style.display = 'none';
            document.querySelector('.scoreBoard').style.display = 'flex';
            if(score == 10) {
                document.querySelector('.msg').innerText = '🌟 Amazing! You are a Space Weather Expert!';
            } else if(score == 0) {
                document.querySelector('.msg').innerText = '😮 Oops! Time to explore the Sun and its storms!';
            } else if(score >= 8) {
                document.querySelector('.msg').innerText = '👍 Great job! You really know your Sun stuff!';
            } else if (score >= 6) {
                document.querySelector('.msg').innerText = '🙂 Not bad! A little more practice and you will shine!';
            } else if(score >= 4) {
                document.querySelector('.msg').innerText = '🤔 Keep going! Learn more about solar phenomena!';
            } else if(score >= 1) {
                document.querySelector('.msg').innerText = '😅 Do not worry! The Sun still has secrets for you!';
            }
            document.querySelector('.score').innerText = 'Score: ' + score;
        })
    }
    clicked = false;
})
function updateSlider(count) {
    document.querySelector('.cardContainer').style.transform = `translateX(-${count * 100}%)`;
}
