//Start

const buttonStart = document.querySelector('.start button');

buttonStart.addEventListener('click', () => {
    buttonStart.parentElement.style.animationPlayState = 'running';
    new Audio('/static/emails/audio/cancion.mp3').play();

    const toAnimations = [document.querySelector('#frist h1'), document.querySelector('#frist img:nth-child(1)'), document.querySelector('#secondImg')];
    toAnimations.forEach(animated => animated.style.animationPlayState = 'running');
})

const idToText = {
    1 : 'frist',
    2 : 'second',
    3 : 'three',
    4 : 'four',
    5 : 'five',
    6 : 'six',
    7 : 'last'
}


//next
const buttonNext = document.querySelector('#next');
var part = 2;

buttonNext.addEventListener('click', () => {
    document.querySelector(`#${idToText[part]}`).style.display = "block";
    document.querySelector(`#${idToText[part-1]}`).style.display = "none";

    switch (part) {
        case 2:
            document.querySelector("#second").style.animationPlayState = 'running';
            break;
        case 3:
            let video = document.querySelector('#three div video');
            video.play();
            video.style.animationPlayState = 'running';
            document.querySelector("#three h1").style.animationPlayState = 'running';
            break;
        case 4:
            document.querySelector('#three div video').pause();
            document.querySelector("#four").style.animationPlayState = 'running';
            break;
        case 5:
            document.querySelector('#five div video').play();
            document.querySelector("#five div video").style.animationPlayState = 'running';
            document.querySelector("#five h1").style.animationPlayState = 'running';
            break;
        case 6:
            document.querySelector('#five div video').pause();
            document.querySelector("#finishimgs").style.animationPlayState = 'running';
            break;
        case 7:
            document.querySelector('#next').style.display = "none";
            break;

        default:
            console.log("Pass");
    }

    part++;
})