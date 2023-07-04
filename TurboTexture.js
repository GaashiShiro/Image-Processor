import { Texture } from "../TGE/texture.js";
import { addElem } from "../TGE/utils.js"
import { Picture } from "./TGE/picture.js";


export class TurboTexture extends Texture{
    constructor(name){
        super(name)
        this.og = null
    }

    async createImage(url){
        this.pic = await Picture.LoadFromFile(url);
        this.canvas = addElem({type:'canvas'});
        this.canvas.width = this.pic.image.width;
        this.canvas.height = this.pic.image.height;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.drawImage(this.pic.image, 0 ,0);
        this.og = this.getData();
    }

    getData(){
        return this.pixels = this.ctx.getImageData(0, 0, this.pic.image.width, this.pic.image.height)
    }

    setData(){
        return this.ctx.putImageData(this.pixels, 0, 0)
    }

    reset() {
        return this.pixels.data.set(this.og.data)
    }

    setBrightness(brightness) {

        for (let y=0; y<this.pixels.height; y++){
            for (let x=0; x<this.pixels.width; x++){
                
                let pixelPos = (y*this.pixels.width+x)*4;
                const red   = this.pixels.data[pixelPos+0];
                const green = this.pixels.data[pixelPos+1];
                const blue  = this.pixels.data[pixelPos+2];
                const alpha = this.pixels.data[pixelPos+3];

                this.pixels.data[pixelPos+0] = red*brightness;
                this.pixels.data[pixelPos+1] = green*brightness;
                this.pixels.data[pixelPos+2] = blue*brightness;
            }
        }
    }

    setGreyScale(value) {
        for (let y=0; y<this.pixels.height; y++){
            for (let x=0; x<this.pixels.width; x++){
                let pixelPos = (y*this.pixels.width+x)*4;
                const red   = this.pixels.data[pixelPos+0]
                const green = this.pixels.data[pixelPos+1]
                const blue  = this.pixels.data[pixelPos+2]
                const alpha = this.pixels.data[pixelPos+3]
                const grey = (red+green+blue)/3*value
                this.pixels.data[pixelPos+0] = grey;
                this.pixels.data[pixelPos+1] = grey;
                this.pixels.data[pixelPos+2] = grey;
    
            }
        }
    }

    setContrast(contrast) {
        const factor = (259*(contrast+255))/(255*(259-contrast));

        for (let y=0; y<this.pixels.height; y++) {
            for (let x=0; x<this.pixels.width; x++) {
                let pixelPos = (y*this.pixels.width+x)*4;
                const red = this.pixels.data[pixelPos+0];
                const green = this.pixels.data[pixelPos+1];
                const blue = this.pixels.data[pixelPos+2];
                const alpha = this.pixels.data[pixelPos+3];

                this.pixels.data[pixelPos+0] = factor*(red-128) + 128;
                this.pixels.data[pixelPos+1] = factor*(green-128) + 128;
                this.pixels.data[pixelPos+2] = factor*(blue-128) + 128;
            }
        }
    }

    setOpacity(opacity) {
        for (let y=0; y<this.pixels.height; y++) {
            for (let x=0; x<this.pixels.width; x++) {
                let pixelPos = (y*this.pixels.width+x)*4;
                const alpha = this.pixels.data[pixelPos+3];
                this.pixels.data[pixelPos+3] = alpha*opacity;
            }
        }
    }

    setHue(hue) {
        const hueRadians = hue*(Math.PI/3);
        const cosHue = Math.cos(hueRadians);
        const sinHue = Math.sin(hueRadians);

        for (let y = 0; y < this.pixels.height; y++) {
            for (let x = 0; x < this.pixels.width; x++) {
                let pixelPos = (y * this.pixels.width + x) * 4;
                const [r, g, b] = this.pixels.data.slice(pixelPos, pixelPos+3);

                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const chroma = max - min;

                const p = (2 * r - g - b) / (2 * chroma);
                const q = (Math.sqrt(3) * (g - b)) / (2 * chroma);

                const newR = max - chroma * (p * cosHue - q * sinHue);
                const newG = max + chroma * (p * sinHue + q * cosHue);
                const newB = max - chroma * (p * cosHue + q * sinHue);

                this.pixels.data[pixelPos + 0] = Math.round(newR);
                this.pixels.data[pixelPos + 1] = Math.round(newG);
                this.pixels.data[pixelPos + 2] = Math.round(newB);
            }
        }
    }
}