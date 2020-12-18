let bars = document.querySelector('#bars');
let inferior = document.querySelector('#inferior');
let links = document.querySelectorAll('#inferior nav a');

let clicks = 0;

bars.addEventListener('click', () => {


    if (clicks % 2 == 0){
        inferior.style.height = "90vh";

        links.forEach(link => {
            link.style.display = "block";
        });
    } else {
        inferior.style.height = "1.5vh";
        links.forEach(link => {
            link.style.display = "none";
        })
    };

    clicks++
});