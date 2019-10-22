import {Canvas} from './canvas';

export class Brush extends Canvas {
    private isMouseDown: boolean = false;
    private _size: number;

    constructor() {
        super();
        this.load();

    }

    public set size(newSize: number) {
        this.context.lineWidth = newSize;
        this._size = newSize;
    }

    public get size(): number {
        return this._size;
    }

    private load() {
        this.canvas.addEventListener('mousedown', () => isMouseDown = true);
        this.canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
            this.context.beginPath();
            // coordinates.push('mouseup');
        });
        this._size = 10;
        this.canvas.addEventListener('mousemove', (event: { clientX: number; clientY: number; }) => {
            if (this.isMouseDown) {
                // coordinates.push({
                //     clientX: event.clientX,
                //     clientY: event.clientY,
                //     color: config.color,
                //     brush: config.size,
                // });
                this.context.lineTo(event.clientX, event.clientY);
                this.context.stroke();
                this.context.beginPath();
                this.context.arc(event.clientX, event.clientY, this.size / 2, 0, Math.PI * 2);
                this.context.fill();
                this.context.beginPath();
                this.context.lineTo(event.clientX, event.clientY);
            }
        });
    }


}