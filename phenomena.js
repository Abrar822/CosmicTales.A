// Generating the circles per click
function generateCircles(event) {
    let circle = document.createElement('div');
    circle.style.top = event.pageY + 'px';
    circle.style.left = event.pageX + 'px';
    circle.classList.add('circles');
    document.body.appendChild(circle);
    setTimeout(() => {
        circle.remove();
    }, 400);
}
document.body.addEventListener('click', (event) => {
    if(!event.target.closest('.navbar')) {
        generateCircles(event); 
    } 
});
// For creating the stars
function genStars(num) {
    for(let i = 0; i < num; i++) {
        let star = document.createElement('div');
        star.classList.add('star');
        star.style.width = `${Math.random() * 2}px`;
        star.style.height = star.style.width;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.opacity = Math.random() * 0.8 + 0.2;
        setTimeout(() => {
            document.body.append(star);
        }, 5 * i)
    }
}

genStars(200);
// To delete stars
function deleteStars(num) {
    let stars = document.querySelectorAll('.star');
    stars.forEach((star, idx) => {
        setTimeout(() => {
            star.remove();
        }, 5 * idx);
    })
}
// For CTA button
let homeContainer = document.querySelector('.homeContainer');
let sunImg = document.querySelector('.sunImg');
let earthImg = document.querySelector('.earthImg');
let sidebar = document.querySelector('.sidebar');
let menuBtn = document.querySelector('.menuBtn');
let homeBtns = document.querySelectorAll('.home');
let phenomenaContainer = document.querySelector('.phenomenaContainer');
// For sidebar
menuBtn.addEventListener('click', () => {
    if(sidebar.style.height === '280px') {
        sidebar.style.height = '0px';
        if(sunImg) sunImg.style.opacity = '1';
        if(earthImg) earthImg.style.opacity = '1';
        if(document.querySelector('.cont')) document.querySelector('.cont').style.opacity = '1';
    } else {
        sidebar.style.height = '280px';
        if(sunImg) sunImg.style.opacity = '0.1';
        if(earthImg) earthImg.style.opacity = '0.1';
        if(document.querySelector('.cont')) document.querySelector('.cont').style.opacity = '0.1';
    }
});
// To hadle switching between the pages
let mapper = {
    '.quiz': 'quiz.html',
    '.events': 'phenomena.html',
    '.glossary': 'glossary.html',
    '.learnMore': 'learnMore.html',
    '.aboutUs': 'aboutUs.html',
    '.home': 'index.html',
    '.references': 'references.html',
    '.chatbot-btn': 'chatbot.html'
};
function switched(mapper) {
    Object.keys(mapper).forEach((key) => {
        let buttons = document.querySelectorAll(`${key}`);
        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                deleteStars(200);
                document.querySelector('.loader').style.display = 'flex';
                setTimeout(() => {
                    document.querySelector('.loader').style.display = 'none';
                    window.location.href = mapper[key];
                }, 200)
            });
        });
    });
}
switched(mapper);
// upScroller
let upScroller = document.querySelector('.upScroller');
let prevScroll = window.scrollY;
window.addEventListener('scroll', () => {
    let currScroll = window.scrollY;
    if(currScroll < prevScroll) {
        upScroller.style.bottom = '0vh';
        setTimeout(() => {
            upScroller.style.bottom = '-80vh';
        }, 6000);
    }
    prevScroll = currScroll;
})
upScroller.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
})
// for switching to the characters.html spacific characters wrt spacific phenomena
function goTo(mapper) {
    document.querySelector('.loader').style.display = 'flex';
    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none';
        window.location.href = `characters.html?phenomenon=${mapper}`;
    }, 200);

}
