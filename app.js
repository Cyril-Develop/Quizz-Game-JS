const gameTitle = document.querySelector('.game h1');
const dataContainer = document.querySelector('.data_container');
const gameContent = document.querySelector('.game_content');
const btnRestart = document.querySelector('#btn_restart');
const playerScore = document.querySelector('#infos_score');
const timer = document.querySelector('#infos_timer');
const progressBarCount = document.querySelector('#progress_bar_count');
const innerProgressBar = document.querySelector('#progress_bar_inner');
const allCategories = document.querySelectorAll('.game_categorie button');

let questionIndex = 0;
let questionNumber = 1;
let score = 0;
let countDown = 10;
let timerId;
let selectedCategory = [];

//FETCH DATA
fetch('./data.json')
    .then(res => {
        if(!res.ok){
            console.log(`error ${res.status}`);
        }
        else {
            res.json().then(data => {
                initChosenCategory(data);
            })
        }
    });

//CHOOSE QUESTION CATEGORIE
function initChosenCategory(allQuestions){

    let startIndex;

    allCategories.forEach(categorie => {
        categorie.addEventListener('click', () => {

          switch(categorie.innerHTML){
            case 'Films':
                startIndex = 0;
                break;
            case 'Sports':
                startIndex = 10;
                break;
            case 'Séries TV':
                startIndex = 20;
                break;
            case 'Dessins animés':
                startIndex = 30;
                break;
            case 'Musiques':
                startIndex = 40;
                break;
            case 'Animaux':
                startIndex = 50;
                break;
            case 'Jeux vidéos':
                startIndex = 60;
                break;
            case 'Histoire':
                startIndex = 70;
                break;
            case 'Années 80':
                startIndex = 80;
                break;
            case 'Géographie':
                startIndex = 90;
                break;
            }

            if(startIndex !== undefined){

                //TIMER
                if(!timerId){
                    startTimer();             
                };

                gameContent.style.display = 'flex';
                document.querySelector('.game_categorie').style.display = 'none';

                selectedCategory = allQuestions.splice(startIndex, 10);

                showCategoryQuestions(selectedCategory);

            };
        })
    })
};

//DISPLAY QUESTION
function showCategoryQuestions(selectedCategory){

    const question = selectedCategory[questionIndex].question;
    const answers = selectedCategory[questionIndex].options;
    const correctAnswer = selectedCategory[questionIndex].answer;

    const questionElement = document.createElement('h2');
    questionElement.innerHTML = question;
    dataContainer.appendChild(questionElement);

    const answersElement = document.createElement('ul');
    dataContainer.appendChild(answersElement);

    answers.forEach(answer => {
        const answerElement = document.createElement('li');
        answerElement.classList.add('list_item');
        answerElement.innerHTML = answer;
        answersElement.appendChild(answerElement);

        answerElement.addEventListener('mouseover', () => {
            answerElement.classList.add('showHover');
        });
        answerElement.addEventListener('mouseout', () => {
            answerElement.classList.remove('showHover');
        });

        checkAnswer(answerElement, correctAnswer);
    })
};

//CHECK GOOD ANSWER AND DISPLAY SCORE
function checkAnswer(answers, correctAnswer){
    
    answers.addEventListener('click', () => {

        if(answers.innerHTML.includes(correctAnswer)){
            answers.classList.add('correctAnswer');
            score++;
        } else {
            answers.classList.add('wrongAnswer');
        }

        countDown = 11;
        
        setTimeout(() => {
            displayNextQuestion();
        }, 200);
        
        playerScore.innerHTML = `${score}`;

        //SHOW RESTART BUTTON
        if(questionNumber >= 10){
            setTimeout(() => {
                gameTitle.innerHTML = 'Game Over';
                btnRestart.style.display = 'block';
            }, 200);
        } 

    });

};

//DISPLAY NEW QUESTION
function displayNextQuestion() {

    questionIndex++;
    questionNumber++;
    
    if(questionNumber <= 10){
        updateProgressBar()
    } else {
        clearInterval(timerId);
        timer.classList.remove('timerPulse');
    };

    const questionElement = document.querySelector('h2');
    const answersElement = document.querySelector('ul');

    questionElement.remove();
    answersElement.remove();

    if (questionIndex < selectedCategory.length) {
        showCategoryQuestions(selectedCategory);
    };
};

//PROGRESS BAR
function updateProgressBar(){
    if(questionNumber <= 10){
        progressBarCount.innerHTML = `${questionNumber} / 10`;
        innerProgressBar.style.width = ` ${(questionNumber * 10)}%`;
    };
};

//START TIMER
function startTimer(){
    timerId = setInterval(() => {
        if(countDown > 0){
            countDown--;
        } else {
            displayNextQuestion();
            countDown = 10;
        }
        countDown <= 5 ? timer.classList.add('timerPulse') : timer.classList.remove('timerPulse');
        countDown < 10 ? timer.innerHTML = `0${countDown}` : timer.innerHTML = `${countDown}`;           
    }, 1000);          
}

//RESTART GAME
btnRestart.addEventListener('click', () => {
    window.location.reload();
});