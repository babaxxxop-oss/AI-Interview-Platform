/*====================================================
        AI MOCK - SETUP PAGE
        setup.js
        PART 1
=====================================================*/

"use strict";

/*====================================================
        DOM ELEMENTS
=====================================================*/

const categoryCards = document.querySelectorAll(".category-card");

const difficultyCards = document.querySelectorAll(".difficulty-card");

const featureCards = document.querySelectorAll(".feature-card");

const slider = document.getElementById("questionSlider");

const questionCount =
document.getElementById("questionCount");

const previewCategory =
document.getElementById("previewCategory");

const previewDifficulty =
document.getElementById("previewDifficulty");

const previewQuestions =
document.getElementById("previewQuestions");

const previewDuration =
document.getElementById("previewDuration");

const form =
document.querySelector("form");

const startButton =
document.querySelector(".start-button");


/*====================================================
                APP STATE
=====================================================*/

const appState={

category:"hr",

difficulty:"easy",

questions:10,

duration:15,

features:{

resume:true,

voice:true,

camera:false,

feedback:true

}

};



/*====================================================
        UTILITY FUNCTIONS
=====================================================*/

function capitalize(text){

if(!text) return "";

return text.charAt(0).toUpperCase()+text.slice(1);

}



function calculateDuration(){

const q=appState.questions;

let total=q*1.5;

if(appState.difficulty==="medium"){

total=q*2;

}

if(appState.difficulty==="hard"){

total=q*2.5;

}

appState.duration=Math.round(total);

}



/*====================================================
        PREVIEW UPDATE
=====================================================*/

function updatePreview(){

calculateDuration();

if(previewCategory){

const card=document.querySelector(
'.category-card.active h3'
);

if(card){

previewCategory.textContent=
card.textContent;

}

}

if(previewDifficulty){

previewDifficulty.textContent=
capitalize(appState.difficulty);

}

if(previewQuestions){

previewQuestions.textContent=
appState.questions;

}

if(previewDuration){

previewDuration.textContent=
appState.duration+" min";

}

if(questionCount){

questionCount.textContent=
appState.questions+
" Questions";

}

}



/*====================================================
        SLIDER
=====================================================*/

function initializeSlider(){

if(!slider) return;

slider.addEventListener("input",()=>{

appState.questions=

parseInt(slider.value);

updatePreview();

});

}



/*====================================================
        RIPPLE EFFECT
=====================================================*/

function createRipple(event){

const button=event.currentTarget;

const ripple=document.createElement("span");

const size=Math.max(

button.clientWidth,

button.clientHeight

);

const rect=

button.getBoundingClientRect();

ripple.style.width=size+"px";

ripple.style.height=size+"px";

ripple.style.left=

event.clientX-rect.left-size/2+"px";

ripple.style.top=

event.clientY-rect.top-size/2+"px";

ripple.className="ripple";

button.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},600);

}



/*====================================================
        BUTTON EFFECT
=====================================================*/

if(startButton){

startButton.addEventListener(

"click",

createRipple

);

}



/*====================================================
        INITIALIZE
=====================================================*/

initializeSlider();

updatePreview();

console.log(

"✅ AI Mock Setup.js Part 1 Loaded"

);

/*====================================================
        CATEGORY SELECTION
=====================================================*/

function initializeCategories() {

    categoryCards.forEach((card) => {

        card.addEventListener("click", () => {

            categoryCards.forEach((c) => {

                c.classList.remove("active");

            });

            card.classList.add("active");

            const input = card.querySelector("input");

            if (input) {

                input.checked = true;

                appState.category = input.value;

            }

            updatePreview();

            saveSettings();

        });

    });

}



/*====================================================
        DIFFICULTY SELECTION
=====================================================*/

function initializeDifficulty() {

    difficultyCards.forEach((card) => {

        card.addEventListener("click", () => {

            difficultyCards.forEach((c) => {

                c.classList.remove("active");

            });

            card.classList.add("active");

            const input = card.querySelector("input");

            if (input) {

                input.checked = true;

                appState.difficulty = input.value;

            }

            updatePreview();

            saveSettings();

        });

    });

}



/*====================================================
        FEATURE TOGGLES
=====================================================*/

function initializeFeatures() {

    featureCards.forEach((card) => {

        card.addEventListener("click", () => {

            card.classList.toggle("active");

            const input = card.querySelector("input");

            if (input) {

                input.checked = !input.checked;

                appState.features[input.name] = input.checked;

            }

            saveSettings();

        });

    });

}



/*====================================================
        LOCAL STORAGE
=====================================================*/

function saveSettings() {

    localStorage.setItem(

        "aimockSetup",

        JSON.stringify(appState)

    );

}



function loadSettings() {

    const saved = localStorage.getItem("aimockSetup");

    if (!saved) return;

    const data = JSON.parse(saved);



    appState.category = data.category || "hr";

    appState.difficulty = data.difficulty || "easy";

    appState.questions = data.questions || 10;

    appState.duration = data.duration || 15;

    appState.features = data.features || appState.features;



    if (slider) {

        slider.value = appState.questions;

    }



    categoryCards.forEach((card) => {

        const input = card.querySelector("input");

        card.classList.remove("active");



        if (input && input.value === appState.category) {

            card.classList.add("active");

            input.checked = true;

        }

    });



    difficultyCards.forEach((card) => {

        const input = card.querySelector("input");

        card.classList.remove("active");



        if (input && input.value === appState.difficulty) {

            card.classList.add("active");

            input.checked = true;

        }

    });



    featureCards.forEach((card) => {

        const input = card.querySelector("input");



        if (!input) return;



        if (appState.features[input.name]) {

            card.classList.add("active");

            input.checked = true;

        } else {

            card.classList.remove("active");

            input.checked = false;

        }

    });



    updatePreview();

}



/*====================================================
        STARTUP INITIALIZATION
=====================================================*/

initializeCategories();

initializeDifficulty();

initializeFeatures();

loadSettings();

console.log("✅ Setup.js Part 2 Loaded");

/*====================================================
        AI MOCK SETUP.JS
                PART 3
=====================================================*/


/*====================================================
            LOADING BUTTON
=====================================================*/

function startLoading() {

    if (!startButton) return;

    startButton.disabled = true;

    startButton.dataset.originalText = startButton.innerHTML;

    startButton.innerHTML = "⏳ Starting Interview...";

    startButton.style.opacity = ".85";

}



/*====================================================
            STOP LOADING
=====================================================*/

function stopLoading() {

    if (!startButton) return;

    startButton.disabled = false;

    startButton.innerHTML =

    startButton.dataset.originalText ||

    "🚀 Start AI Interview";

    startButton.style.opacity = "1";

}



/*====================================================
            FORM VALIDATION
=====================================================*/

function validateForm() {

    if (!appState.category) {

        alert("Please select an interview category.");

        return false;

    }

    if (!appState.difficulty) {

        alert("Please select a difficulty.");

        return false;

    }

    return true;

}



/*====================================================
            SUBMIT FORM
=====================================================*/

function initializeForm() {

    if (!form) return;

    form.addEventListener("submit", (event) => {

        if (!validateForm()) {

            event.preventDefault();

            return;

        }

        startLoading();

    });

}



/*====================================================
        KEYBOARD SHORTCUTS
=====================================================*/

function initializeKeyboardShortcuts() {

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            stopLoading();

        }

        if (

            event.ctrlKey &&

            event.key === "Enter"

        ) {

            event.preventDefault();

            form.requestSubmit();

        }

    });

}



/*====================================================
        INTERVIEW DURATION UPDATE
=====================================================*/

function updateDurationLabel() {

    calculateDuration();

    if (previewDuration) {

        previewDuration.textContent =

        appState.duration + " min";

    }

}



/*====================================================
        SAVE BEFORE LEAVING
=====================================================*/

window.addEventListener("beforeunload", () => {

    saveSettings();

});



/*====================================================
            SMALL ANIMATIONS
=====================================================*/

function animateCards() {

    const cards = document.querySelectorAll(

        ".category-card,.feature-card"

    );

    cards.forEach((card, index) => {

        card.style.animationDelay =

        `${index * 80}ms`;

    });

}



/*====================================================
        RIPPLE STYLE
=====================================================*/

const rippleStyle = document.createElement("style");

rippleStyle.innerHTML = `

.ripple{

position:absolute;

border-radius:50%;

transform:scale(0);

animation:ripple .6s linear;

background:rgba(255,255,255,.45);

pointer-events:none;

}

@keyframes ripple{

to{

transform:scale(4);

opacity:0;

}

}

`;

document.head.appendChild(rippleStyle);



/*====================================================
            START EVERYTHING
=====================================================*/

initializeForm();

initializeKeyboardShortcuts();

animateCards();

updateDurationLabel();

updatePreview();



console.log(

"%cAI Mock Setup Loaded Successfully",

"color:#7c3aed;font-size:16px;font-weight:bold"

);



/*====================================================
                END OF FILE
=====================================================*/