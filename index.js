const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const config = {
    brush: {},
    size: 10,
    color: {},
};
let isMouseDown = false;
const coordinates = [];

renderList();
canvas.addEventListener('mousedown', () => isMouseDown = true);
canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
    context.beginPath();
    coordinates.push('mouseup');
});

context.lineWidth = config.size;

canvas.addEventListener('mousemove', event => {
    if (isMouseDown) {
        coordinates.push({
            clientX: event.clientX,
            clientY: event.clientY
        });
        context.lineTo(event.clientX, event.clientY);
        context.stroke();
        context.beginPath();
        context.arc(event.clientX, event.clientY, config.size / 2, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.lineTo(event.clientX, event.clientY);
    }
});

function clearCanvas() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.fillStyle = '#000';
}

function save() {
    const name = document.getElementById('drawingName').value;
    if (!coordinates.length) {
        return console.log('Холст чист');
    }

    if (!name.length) {
        return console.log('Введи имя');
    }

    if (JSON.parse(localStorage.getItem(name))) {
        return console.log('Рисунок с таким именем уже есть');
    }

    localStorage.setItem(name, JSON.stringify(coordinates));

    const list = document.getElementById('list');
    list.append(createHtmlListItem(name));
}

function remove(name) {
    localStorage.removeItem(name);
    const listItem = document.getElementById(name);
    const list = document.getElementById('list');
    list.removeChild(listItem);
}

function replay(name) {
    const coords = JSON.parse(localStorage.getItem(name));
    coordinates.push(...coords);
    if (!coords.length) {
        context.beginPath();
        console.log('Нет сохранений');
        return;
    }
    clearCanvas();
    coords.forEach(element => {
        if (element === 'mouseup') context.beginPath();

        context.lineTo(element.clientX, element.clientY);
        context.stroke();
        context.beginPath();
        context.arc(element.clientX, element.clientY, config.size / 2, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.lineTo(element.clientX, element.clientY);
    });
}

function completeCleaningCanvas() {
    clearCanvas();
    coordinates.length = 0;
}

function createHtmlListItem(name) {
    const li = document.createElement('li');
    li.setAttribute('id', name);

    const link = document.createElement('a');
    link.innerText = name;
    link.setAttribute('onclick', `replay('${name}')`);

    const button = document.createElement('button');
    button.innerText = 'x';
    button.setAttribute('onclick', `remove('${name}')`);

    li.append(link);
    li.append(button);

    return li;
}

function renderList() {
    const length = localStorage.length;
    const list = document.getElementById('list');
    for (let i = 0; i < length; i++) {
        list.append(createHtmlListItem(localStorage.key(i)));
    }
}