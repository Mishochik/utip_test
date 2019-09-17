const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const config = {
    size: 10,
    color: '#000000',
};
let isMouseDown = false;
const coordinates = [];
const colorList = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#cccccc'];

renderList();
renderPalette();
defaultColor();
renderBrushes();

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
            clientY: event.clientY,
            color: config.color,
            brush: config.size,
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
    context.fillStyle = config.color;
}

function save() {
    const input = document.getElementById('drawingName');
    const name = input.value;
    input.value = '';
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

        brushChange(element.brush)
        colorChange(element.color);
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
        const picture = localStorage.key(i);
        if (picture === 'defaultColor') continue;
        list.append(createHtmlListItem(picture));
    }
}

function renderPalette() {
    const palette = document.getElementById('palette');
    colorList.forEach(item => {
        const div = createHtmlPaletteColor(item);
        palette.appendChild(div);
    });
}

function createHtmlPaletteColor(color) {
    const div = document.createElement('div');
    div.setAttribute('onclick', `colorChange('${color}')`);
    div.classList.add('color');
    div.style.backgroundColor = color;
    return div;
}

function colorChange(color) {
    config.color = color;
    context.fillStyle = config.color;
    context.strokeStyle = config.color;
    localStorage.setItem('defaultColor', config.color);
}

function defaultColor() {
    const color = localStorage.getItem('defaultColor');
    color ? colorChange(color) : colorChange(colorList[1]);
}

function renderBrushes() {
    const brushSet = document.getElementById('brushSet');
    brushSet.appendChild(createHtmlBrush('10'));
    brushSet.appendChild(createHtmlBrush('20'));
    brushSet.appendChild(createHtmlBrush('30'));
}

function createHtmlBrush(brush) {
    const div = document.createElement('div');
    div.setAttribute('onclick', `brushChange('${brush}')`);
    div.classList.add('brush');
    div.style.border = 'solid';
    div.innerText = brush;
    return div;
}

function brushChange(brush) {
    config.size = brush;
    context.lineWidth = config.size;
}
