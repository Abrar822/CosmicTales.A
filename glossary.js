let glossLink = "https://raw.githubusercontent.com/Abrar822/Json.A/refs/heads/main/gloss_Cosmic_Tales.json";
let data = []
// to get the glossary data
async function fetcher() {
    let response = await fetch(glossLink);
    data = await response.json();
    data = data.glossary;
    console.log(data);
}
// To create card
function createCard(card, idx) {
    let term = data[idx].term;
    let definition = data[idx].definition;
    card.innerHTML = `
    <div class="term">${term} <i class="fa-solid fa-caret-down"></i></div>
    <div class="defin">${definition}</div>`;
}
// function glossary generator
function glossaryGenerator() {
    for(let i = 0; i < data.length; i++) {
        let card = document.createElement('div');
        card.classList.add('card');
        document.querySelector('.glossaryContainer .container').append(card);
        createCard(card, i);
        let term = card.querySelector('.term');
        let def = card.querySelector('.defin');
        let caret = term.querySelector('i');
        term.addEventListener('click', () => {
            document.querySelectorAll('.defin').forEach((d) => {
                if(d != def) {
                    d.classList.remove('toggle');
                    document.querySelectorAll('.term i').forEach(c => {
                        if (c !== caret) c.classList.remove('rotate');
                    });
                }
            })
            def.classList.toggle('toggle');
            caret.classList.toggle('rotate');
        })
    }
}
// async executor
async function executor() {
    await fetcher();
    glossaryGenerator();
}
executor();