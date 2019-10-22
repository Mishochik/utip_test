export class Canvas {
    protected canvas: any;
    protected  context: any;

    install() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
    }
}