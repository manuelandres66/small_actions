
const petiton = (start, end) => {
    fetch('/account/api/ranking', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({'start': start, 'end' : end})
    })
    .then(response => response.json())
    .then(data => {
        if (data.last == undefined) {
            let mayorDiv = document.querySelector('#mayor');
            const username = document.querySelector('#username').innerHTML;
            data.people.forEach(position => {
                
                let newDiv = document.createElement("div");
                newDiv.innerHTML = `<h5>${position.ranking}</h5>
                <h6>${position.username}</h6>
                <span>${position.points}</span>`;
                
                newDiv.setAttribute('class', 'column');

                if (position.username == username) {
                    newDiv.setAttribute('id', 'you');
                };
        
                mayorDiv.appendChild(newDiv);
            });
            
            if (start == 4) {
                const you = document.getElementById('you');
                you.scrollIntoView({ behavior: 'smooth', block: 'center' })
            };
        };
        
    })
};

let current = parseInt(document.querySelector('#ranking').innerHTML) + 10;

petiton(4, current);

current += 6;

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        petiton(current, current + 10);
        current += 11;
    };
})