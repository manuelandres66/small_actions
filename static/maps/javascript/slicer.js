let divImg = document.querySelector('#images');

const leftStep = 0.2;
let counter = 0;
const imgesSlice = document.querySelectorAll('.slice');

const widthForAll = 120 / (imgesSlice.length / 2);

imgesSlice.forEach(image => {
    image.style.width = `${widthForAll}vw`
})

const moveLeft = () => {
    counter -= leftStep;
    divImg.style.transform = `translate(${counter}vw)`; //Transform not left

    if (counter <= -120) { 
        counter = 0;
    };
};

setInterval(moveLeft, 50);


// Circle animation
window.addEventListener('load', () => {

    let selector = document.querySelector('#organization_info img');
    let rect = selector.getBoundingClientRect();
    // init part, set your own values
    let sat = {
        elt: null,
        a: 0,         // in radian,
        r: 110,        // radius
        da: 0.1,     // in radian
        x: 0,
        y: 0,
        center : { x: ((rect.left + rect.right) / 2), y: ((rect.top + rect.bottom) / 2)}
    }


    sat.move = function(){


        // each modification
        this.a += this.da
        this.x = this.center.x + (this.r * Math.sin(this.a));
        this.y = this.center.y + (this.r * Math.cos(this.a));
        //console.log(this.x, this.y);
        this.elt.style.top = this.y + "px";
        this.elt.style.left = this.x + "px";



    }

    sat.elt = document.querySelector('#frist');
    setInterval(function(){
        sat.move();
    }, 50);

});

//Send Icon

document.querySelector('#send_icon').addEventListener('click', () => {
    document.querySelector('form').submit();
});