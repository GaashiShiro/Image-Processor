import { TurboTexture } from "./TurboTexture.js";
import { addElem } from "./TGE/utils.js"

const createSlider =(name, min, max, value)=> {
    const ui = document.getElementById('ui')
    const slider = addElem({type:'input', parent: ui})
    slider.type = 'range';
    slider.min=min;
    slider.max=max;
    slider.value=value;
    slider.textContent = name;
    return slider
}

const main = async ()=>{
    const og = new TurboTexture('original_girl');
    await og.createImage('./00147-1731466980.png');

    const img = new TurboTexture('girl');
    await img.createImage('./00147-1731466980.png');

    img.getData();
    

    let brightness = createSlider('Brightness', 0, 50, 1);
    brightness.addEventListener('input', ()=>{
        img.setBrightness(brightness.value);
        img.setData();
        img.reset()
    })

    let grayscale = createSlider('GrayScale', 0, 10, 1);
    grayscale.addEventListener('input', ()=>{
        img.setGreyScale(grayscale.value);
        img.setData();
        img.reset()
    })
    
    let hue = createSlider('Hue', 0, 100, 1);
    hue.addEventListener('input', ()=>{
        img.setHue(hue.value);
        img.setData();
        img.reset();
    })
    
    //img.setContrast(255)
    //img.setOpacity(0.5)
    //img.setHue(1)
    //img.setData();
}

main();