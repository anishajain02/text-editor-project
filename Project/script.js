const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let texts = [];
let undoStack = [];
let redoStack = [];
let isDragging = false;
let dragIndex = null;

document.getElementById('addText').addEventListener('click', () => {
    const text = prompt('Enter text:');
    if (text) {
        const font = document.getElementById('fontSelect').value;
        const size = document.getElementById('fontSize').value;
        const color = document.getElementById('fontColor').value;
        const y = texts.length > 0 ? texts[texts.length - 1].y + parseInt(size) + 10 : 50;
        const newText = { text, font, size, color, x: 50, y: y };
        texts.push(newText);
        undoStack.push([...texts]);

        // Increase the canvas height if necessary
        if (y + parseInt(size) > canvas.height) {
            canvas.height = y + parseInt(size) + 10;
        }

        redraw();
        scrollToBottom();
    }
});

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    texts.forEach(t => {
        ctx.font = `${t.size}px ${t.font}`;
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, t.x, t.y);
    });
}

function scrollToBottom() {
    const container = document.querySelector('.canvas-container');
    container.scrollTop = container.scrollHeight;
}

canvas.addEventListener('mousedown', (e) => {
    const { offsetX, offsetY } = e;
    texts.forEach((t, index) => {
        const width = ctx.measureText(t.text).width;
        if (offsetX >= t.x && offsetX <= t.x + width && offsetY >= t.y - t.size && offsetY <= t.y) {
            isDragging = true;
            dragIndex = index;
        }
    });
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging && dragIndex !== null) {
        const { offsetX, offsetY } = e;
        texts[dragIndex].x = offsetX;
        texts[dragIndex].y = offsetY;
        redraw();
    }
});

canvas.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        dragIndex = null;
        undoStack.push([...texts]);
    }
});

document.getElementById('undo').addEventListener('click', () => {
    if (undoStack.length > 0) {
        redoStack.push(undoStack.pop());
        texts = undoStack.length > 0 ? undoStack[undoStack.length - 1] : [];
        redraw();
    }
});

document.getElementById('redo').addEventListener('click', () => {
    if (redoStack.length > 0) {
        texts = redoStack.pop();
        undoStack.push([...texts]);
        redraw();
    }
});
