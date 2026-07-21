/*=========================================================
PROJECT AURORA
script.js
PART 1A
Core Engine + Utilities + Lenis + GSAP Setup
=========================================================*/

"use strict";

/*=========================================================
CONFIG
=========================================================*/

const CONFIG = {

    debug: true,

    loaderDuration: 2500,

    scrollEase: 0.08,

    mouseStrength: 40,

    enableCursorGlow: true,

    enableParticles: true,

    enableParallax: true,

    mobileBreakpoint: 768,

    fps: 60

};

/*=========================================================
DOM CACHE
=========================================================*/

const DOM = {

    body: document.body,

    html: document.documentElement,

    loader: document.querySelector(".loader"),

    progress: document.querySelector(".scroll-progress"),

    hero: document.querySelector(".hero"),

    stars: document.querySelector(".stars"),

    aurora: document.querySelector(".aurora"),

    music: document.querySelector("#bgMusic"),

    cursor: document.querySelector(".cursor"),

    backTop: document.querySelector(".back-top"),

    sections: document.querySelectorAll("section"),

    cards: document.querySelectorAll(".glass"),

    buttons: document.querySelectorAll(".btn-premium")

};

/*=========================================================
STATE
=========================================================*/

const STATE = {

    loaded: false,

    scrolling: false,

    mouseX: 0,

    mouseY: 0,

    lastScroll: 0,

    width: window.innerWidth,

    height: window.innerHeight,

    mobile: window.innerWidth < CONFIG.mobileBreakpoint

};

/*=========================================================
HELPERS
=========================================================*/

const $ = (s)=>document.querySelector(s);

const $$ = (s)=>document.querySelectorAll(s);

const clamp=(v,min,max)=>Math.min(Math.max(v,min),max);

const lerp=(a,b,t)=>a+(b-a)*t;

const random=(min,max)=>Math.random()*(max-min)+min;

const map=(value,inMin,inMax,outMin,outMax)=>{

    return (value-inMin)*(outMax-outMin)/(inMax-inMin)+outMin;

};

const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

function log(...msg){

    if(CONFIG.debug){

        console.log("[Aurora]",...msg);

    }

}

/*=========================================================
LENIS
=========================================================*/

let lenis=null;

function initLenis(){

    if(typeof Lenis==="undefined"){

        console.warn("Lenis not found.");

        return;

    }

    lenis=new Lenis({

        duration:1.2,

        smoothWheel:true,

        wheelMultiplier:1,

        touchMultiplier:2,

        infinite:false

    });

    function raf(time){

        lenis.raf(time);

        requestAnimationFrame(raf);

    }

    requestAnimationFrame(raf);

    log("Lenis Ready");

}

/*=========================================================
GSAP
=========================================================*/

function initGSAP(){

    if(typeof gsap==="undefined"){

        console.warn("GSAP missing.");

        return;

    }

    if(typeof ScrollTrigger!=="undefined"){

        gsap.registerPlugin(ScrollTrigger);

    }

    gsap.defaults({

        ease:"power3.out",

        duration:1

    });

    log("GSAP Ready");

}

/*=========================================================
WINDOW
=========================================================*/

window.addEventListener("resize",()=>{

    STATE.width=window.innerWidth;

    STATE.height=window.innerHeight;

    STATE.mobile=window.innerWidth<CONFIG.mobileBreakpoint;

});

window.addEventListener("scroll",()=>{

    STATE.lastScroll=window.scrollY;

});

/*=========================================================
MOUSE
=========================================================*/

window.addEventListener("mousemove",(e)=>{

    STATE.mouseX=e.clientX;

    STATE.mouseY=e.clientY;

});

/*=========================================================
SCROLL PROGRESS
=========================================================*/

function updateProgress(){

    if(!DOM.progress) return;

    const max=document.body.scrollHeight-window.innerHeight;

    const percent=(window.scrollY/max)*100;

    DOM.progress.style.width=percent+"%";

}

/*=========================================================
BACK TO TOP
=========================================================*/

function initBackTop(){

    if(!DOM.backTop) return;

    window.addEventListener("scroll",()=>{

        if(window.scrollY>700){

            DOM.backTop.classList.add("show");

        }else{

            DOM.backTop.classList.remove("show");

        }

    });

    DOM.backTop.addEventListener("click",()=>{

        if(lenis){

            lenis.scrollTo(0);

        }else{

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        }

    });

}

/*=========================================================
BUTTON EFFECTS
=========================================================*/

function initButtons(){

    DOM.buttons.forEach(btn=>{

        btn.addEventListener("mouseenter",()=>{

            if(typeof gsap==="undefined") return;

            gsap.to(btn,{

                scale:1.05,

                duration:.3

            });

        });

        btn.addEventListener("mouseleave",()=>{

            if(typeof gsap==="undefined") return;

            gsap.to(btn,{

                scale:1

            });

        });

    });

}

/*=========================================================
SECTION OBSERVER
=========================================================*/

function observeSections(){

    const observer=new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("visible");

            }

        });

    },{

        threshold:.2

    });

    DOM.sections.forEach(sec=>observer.observe(sec));

}

/*=========================================================
MAIN LOOP
=========================================================*/

function update(){

    updateProgress();

    requestAnimationFrame(update);

}

/*=========================================================
START
=========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    log("Initializing Aurora...");

    initLenis();

    initGSAP();

    initBackTop();

    initButtons();

    observeSections();

    update();

});

/*=========================================================
PROJECT AURORA
script.js
PART 1B
Loader + Intro Timeline + Hero + Startup
=========================================================*/

"use strict";

/*=========================================================
LOADER
=========================================================*/

async function playLoader() {

    if (!DOM.loader) {
        STATE.loaded = true;
        return;
    }

    document.body.style.overflow = "hidden";

    if (typeof gsap !== "undefined") {

        const tl = gsap.timeline();

        tl.from(".loader-logo", {
            opacity: 0,
            scale: 0.6,
            duration: 1
        });

        tl.from(".loader-text", {
            opacity: 0,
            y: 30,
            duration: .8
        }, "-=.5");

        tl.to(".loader-progress", {
            width: "100%",
            duration: CONFIG.loaderDuration / 1000,
            ease: "power1.inOut"
        });

        tl.to(DOM.loader, {
            opacity: 0,
            duration: .8,
            delay: .3
        });

        await sleep(CONFIG.loaderDuration + 1200);

    } else {

        await sleep(CONFIG.loaderDuration);

    }

    DOM.loader.style.display = "none";

    document.body.style.overflow = "";

    STATE.loaded = true;

}

/*=========================================================
INTRO TIMELINE
=========================================================*/

function playIntro() {

    if (typeof gsap === "undefined") return;

    const tl = gsap.timeline();

    tl.from(".hero-title", {

        opacity: 0,

        y: 80,

        duration: 1.3

    });

    tl.from(".hero-subtitle", {

        opacity: 0,

        y: 40,

        duration: .8

    }, "-=.6");

    tl.from(".hero-buttons>*", {

        opacity: 0,

        y: 25,

        stagger: .15

    });

    tl.from(".scroll-indicator", {

        opacity: 0,

        y: -20,

        repeat: -1,

        yoyo: true,

        duration: 1

    });

}

/*=========================================================
HERO PARALLAX
=========================================================*/

function initHeroParallax() {

    if (!DOM.hero) return;

    window.addEventListener("mousemove", e => {

        const x = (e.clientX / window.innerWidth - .5) * 30;

        const y = (e.clientY / window.innerHeight - .5) * 30;

        if (DOM.aurora) {

            DOM.aurora.style.transform =
                `translate(${x}px,${y}px)`;

        }

        if (DOM.stars) {

            DOM.stars.style.transform =
                `translate(${x * .4}px,${y * .4}px)`;

        }

    });

}

/*=========================================================
MUSIC
=========================================================*/

function initMusic() {

    if (!DOM.music) return;

    DOM.music.volume = .35;

    const unlock = () => {

        DOM.music.play().catch(() => {});

        window.removeEventListener("click", unlock);

        window.removeEventListener("touchstart", unlock);

    };

    window.addEventListener("click", unlock);

    window.addEventListener("touchstart", unlock);

}

/*=========================================================
CURSOR GLOW
=========================================================*/

function initCursor() {

    if (!DOM.cursor) return;

    window.addEventListener("mousemove", e => {

        DOM.cursor.style.left = e.clientX + "px";

        DOM.cursor.style.top = e.clientY + "px";

    });

}

/*=========================================================
SECTION REVEAL
=========================================================*/

function revealSections() {

    if (typeof gsap === "undefined") return;

    DOM.sections.forEach(section => {

        gsap.from(section, {

            opacity: 0,

            y: 80,

            duration: 1,

            scrollTrigger: {

                trigger: section,

                start: "top 75%"

            }

        });

    });

}

/*=========================================================
FLOATING CARDS
=========================================================*/

function floatCards() {

    if (typeof gsap === "undefined") return;

    document.querySelectorAll(".travel-card,.memory-card,.glass")
        .forEach(card => {

            gsap.to(card, {

                y: random(-12, 12),

                duration: random(3, 6),

                repeat: -1,

                yoyo: true,

                ease: "sine.inOut"

            });

        });

}

/*=========================================================
PERFORMANCE
=========================================================*/

function monitorPerformance() {

    let fps = 0;

    let last = performance.now();

    function frame(now) {

        fps++;

        if (now > last + 1000) {

            if (CONFIG.debug) {

                console.log("FPS:", fps);

            }

            fps = 0;

            last = now;

        }

        requestAnimationFrame(frame);

    }

    requestAnimationFrame(frame);

}

/*=========================================================
PRELOAD IMAGES
=========================================================*/

function preloadImages() {

    document.querySelectorAll("img").forEach(img => {

        const image = new Image();

        image.src = img.src;

    });

}

/*=========================================================
STARTUP
=========================================================*/

async function startup() {

    await playLoader();

    playIntro();

    initHeroParallax();

    initMusic();

    initCursor();

    revealSections();

    floatCards();

    preloadImages();

    monitorPerformance();

    console.log("Project Aurora Started");

}

/*=========================================================
BOOT
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    startup();

});

/*=========================================================
END OF PART 1B

NEXT:
PART 2
Hero Cinematic + Aurora Background + Stars +
Mouse Light + Scroll Indicator + Premium Effects
=========================================================*/

/*=========================================================
PROJECT AURORA
script.js
PART 2
Hero Cinematic + Aurora + Stars +
Mouse Light + Scroll Indicator + Premium Effects
=========================================================*/

"use strict";

/*=========================================================
HERO TIMELINE
=========================================================*/

function heroCinematic() {

    if (typeof gsap === "undefined") return;

    const tl = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    tl.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.3
    })

    .from(".hero-subtitle", {
        y: 60,
        opacity: 0,
        duration: 1
    }, "-=.8")

    .from(".hero-description", {
        y: 40,
        opacity: 0,
        duration: .8
    }, "-=.6")

    .from(".hero-buttons>*", {
        opacity: 0,
        y: 25,
        stagger: .15
    }, "-=.4")

    .from(".scroll-indicator", {
        opacity: 0,
        scale: .5
    }, "-=.2");

}

/*=========================================================
SCROLL INDICATOR
=========================================================*/

function scrollIndicatorAnimation(){

    const indicator=document.querySelector(".scroll-indicator");

    if(!indicator) return;

    gsap.to(indicator,{

        y:20,

        repeat:-1,

        yoyo:true,

        ease:"sine.inOut",

        duration:1.2

    });

}

/*=========================================================
AURORA FLOATING
=========================================================*/

function auroraAnimation(){

    const aurora=document.querySelector(".aurora");

    if(!aurora) return;

    gsap.to(aurora,{

        x:120,

        duration:12,

        repeat:-1,

        yoyo:true,

        ease:"sine.inOut"

    });

    gsap.to(aurora,{

        y:70,

        duration:8,

        repeat:-1,

        yoyo:true,

        ease:"sine.inOut"

    });

    gsap.to(aurora,{

        rotation:6,

        duration:18,

        repeat:-1,

        yoyo:true,

        ease:"none"

    });

}

/*=========================================================
STAR FIELD
=========================================================*/

function createStars(){

    const stars=document.querySelector(".stars");

    if(!stars) return;

    for(let i=0;i<180;i++){

        const star=document.createElement("span");

        star.className="star";

        const size=Math.random()*3+1;

        star.style.width=size+"px";

        star.style.height=size+"px";

        star.style.left=Math.random()*100+"%";

        star.style.top=Math.random()*100+"%";

        star.style.animationDelay=Math.random()*8+"s";

        star.style.animationDuration=(3+Math.random()*6)+"s";

        stars.appendChild(star);

    }

}

/*=========================================================
STAR TWINKLE
=========================================================*/

function animateStars(){

    document.querySelectorAll(".star").forEach(star=>{

        gsap.to(star,{

            opacity:random(.2,1),

            scale:random(.5,1.5),

            repeat:-1,

            yoyo:true,

            duration:random(2,5),

            ease:"sine.inOut"

        });

    });

}

/*=========================================================
PARALLAX
=========================================================*/

function parallaxHero(){

    const hero=document.querySelector(".hero");

    if(!hero) return;

    hero.addEventListener("mousemove",(e)=>{

        const x=(e.clientX/window.innerWidth-.5);

        const y=(e.clientY/window.innerHeight-.5);

        gsap.to(".hero-content",{

            x:x*25,

            y:y*25,

            duration:1

        });

        gsap.to(".aurora",{

            x:x*60,

            y:y*60,

            duration:2

        });

        gsap.to(".stars",{

            x:x*12,

            y:y*12,

            duration:1.5

        });

    });

}

/*=========================================================
MOUSE LIGHT
=========================================================*/

function mouseLight(){

    const light=document.createElement("div");

    light.className="mouse-light";

    document.body.appendChild(light);

    window.addEventListener("mousemove",(e)=>{

        gsap.to(light,{

            left:e.clientX,

            top:e.clientY,

            duration:.35,

            ease:"power2.out"

        });

    });

}

/*=========================================================
BUTTON GLOW
=========================================================*/

function premiumButtons(){

    document.querySelectorAll(".btn-premium").forEach(btn=>{

        btn.addEventListener("mouseenter",()=>{

            gsap.to(btn,{

                scale:1.05,

                boxShadow:"0 0 40px rgba(255,95,162,.6)",

                duration:.3

            });

        });

        btn.addEventListener("mouseleave",()=>{

            gsap.to(btn,{

                scale:1,

                boxShadow:"0 10px 25px rgba(0,0,0,.2)",

                duration:.3

            });

        });

    });

}

/*=========================================================
TEXT GLOW
=========================================================*/

function glowingText(){

    document.querySelectorAll(".gradient-text").forEach(text=>{

        gsap.to(text,{

            textShadow:

            "0 0 10px rgba(255,255,255,.6),0 0 25px rgba(255,120,180,.5)",

            repeat:-1,

            yoyo:true,

            duration:2

        });

    });

}

/*=========================================================
HERO SCROLL SCALE
=========================================================*/

function heroScroll(){

    gsap.to(".hero",{

        scale:1.08,

        scrollTrigger:{

            trigger:".hero",

            start:"top top",

            end:"bottom top",

            scrub:1

        }

    });

    gsap.to(".hero-content",{

        y:-180,

        opacity:.2,

        scrollTrigger:{

            trigger:".hero",

            start:"top top",

            end:"bottom top",

            scrub:1

        }

    });

}

/*=========================================================
BACKGROUND PARTICLES
=========================================================*/

function backgroundParticles(){

    const container=document.body;

    for(let i=0;i<40;i++){

        const p=document.createElement("div");

        p.className="particle";

        p.style.left=Math.random()*100+"vw";

        p.style.top=Math.random()*100+"vh";

        container.appendChild(p);

        gsap.to(p,{

            y:-800,

            opacity:0,

            repeat:-1,

            delay:Math.random()*5,

            duration:8+Math.random()*8,

            ease:"none"

        });

    }

}

/*=========================================================
INITIALIZE PART 2
=========================================================*/

function initPart2(){

    heroCinematic();

    scrollIndicatorAnimation();

    auroraAnimation();

    createStars();

    animateStars();

    parallaxHero();

    mouseLight();

    premiumButtons();

    glowingText();

    heroScroll();

    backgroundParticles();

    console.log("Aurora Part 2 Loaded");

}

document.addEventListener("DOMContentLoaded",()=>{

    initPart2();

});

/*=========================================================
END OF PART 2

NEXT:
PART 3
School Chapter + Timeline +
Instagram Scene + Memory Reveal +
Phone Notifications + Scroll Story
=========================================================*/