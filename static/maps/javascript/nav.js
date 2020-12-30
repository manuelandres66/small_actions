let bars = document.querySelector('#bars');
let inferior = document.querySelector('#inferior');
let links = document.querySelectorAll('#inferior nav a');

let clicks = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};  

bars.addEventListener('click', async () => {


    if (clicks % 2 == 0){
        inferior.style.height = "90vh";
        await sleep(180);
        links.forEach(link => {
            link.style.display = "block";
        });
    } else {
        inferior.style.height = "1.5vh";
        await sleep(300);
        links.forEach(link => {
            link.style.display = "none";
        })

    };

    clicks++
});