// o State será uma variável de objeto que tem objetos dentro.
const state ={
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides : {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards")
    },
    actions:{
        button: document.getElementById("next-duel"),
    },
    
};



const pathImages = "./src/assets/icons/";

const cardData =[
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
];

async function getRandomCardId() {
    const randowIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randowIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){
        cardImage.addEventListener("mouseover", ()=>{
        drawSelectCard(IdCard)
        });
        
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    

    return cardImage;
}

async function ShowHiddenCardFieldsImages(value) {
    //value será um boleano
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } else if (value === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function setCardsField(cardId) {

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    ShowHiddenCardFieldsImages(true);
    
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose : ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, ComputerCardId) {
    let duelResults = "DrAw"
    let playerCard = cardData[playerCardId];

    /*
    tirei as duas condições IF e coloquei uma condição IF ELSE IF e ELSE para 
    chamar as condições e implementar o audio para empate
    */

    if(playerCard.WinOf.includes(ComputerCardId)){
        duelResults = "WIN";
        await playAudio("win.wav");
        state.score.playerScore++;
    } else if(playerCard.LoseOf.includes (ComputerCardId)){
        duelResults = "lose";
        await playAudio("lose.wav");
        state.score.computerScore++;
    } else {
        await playAudio("draw.mp3");
    }

    return duelResults;
}

async function removeAllCardsImages() {

    //fazer uma desestruturação
    let {computerBOX, player1BOX} = state.playerSides
    let imgElements = computerBOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());
    
    
    imgElements = player1BOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());


}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute : " + cardData[index].type;
    
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++) {
        const randowIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randowIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

/*Função para definir o estado inicial*/
function init(){
    drawCards(5, state.playerSides.player1); // para mudar num lugar só
    drawCards(5, state.playerSides.computer);
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    ShowHiddenCardFieldsImages(false);

    state.cardSprites.name.innerText = "Selecione"; //meu incremento
    state.cardSprites.type.innerText = "uma carta"; //meu incremento

    init ();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}`)
    audio.volume = 0.3; // meu incremento, ajustando o volume do audio
    audio.play();
}

init()