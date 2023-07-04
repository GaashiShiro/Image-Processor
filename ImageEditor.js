import { TurboTexture } from "./TurboTexture.js";

export class ImageEditor {
  constructor(imageUrl, canvas, sliderContainer) {
    this.imageUrl = imageUrl;
    this.canvas = canvas;
    this.sliderContainer = sliderContainer;
    this.imageTexture = null;
    this.effects = {
      brightness: 1.0,
      grayscale: 0.0,
      contrast: 1.0,
      opacity: 1.0,
      hue: 0.0
    };
    this.originalData = null; // Store the original image data
  }

  async init() {
    // Load the image and initialize the image texture
    this.imageTexture = new TurboTexture('image');
    await this.imageTexture.createImage(this.imageUrl);

    // Store the original image data
    this.originalData = this.imageTexture.getData();

    // Set up the sliders
    this.createSliders();

    // Apply the initial effects
    this.applyEffects();
  }

  // Rest of the code...

  revertChanges() {
    // Reset the image data to the original data
    this.imageTexture.setData(this.originalData);

    // Apply the effects based on the updated slider values
    this.applyEffects();
  }



  async createImageTexture() {
    this.imageTexture = new TurboTexture('image');
    await this.imageTexture.createImage(this.imageUrl);
  }

  createSlider(label, min, max, step, value, onChange) {
    const container = document.createElement('div');
    const slider = document.createElement('input');
    const sliderLabel = document.createElement('label');

    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;

    slider.addEventListener('input', () => {
      onChange(parseFloat(slider.value));
    });

    sliderLabel.textContent = label;

    container.appendChild(sliderLabel);
    container.appendChild(slider);

    this.sliderContainer.appendChild(container);
  }

  createSliders() {
    for (const effect in this.effects) {
      const value = this.effects[effect];
      this.createSlider(effect, 0, 1, 0.1, value, (newValue) => {
        this.effects[effect] = newValue;
        this.applyEffects();
      });
    }
  }

  applyEffects() {
    this.imageTexture.setBrightness(this.effects.brightness);
    this.imageTexture.setGreyScale(this.effects.grayscale);
    this.imageTexture.setContrast(this.effects.contrast);
    this.imageTexture.setOpacity(this.effects.opacity);
    this.imageTexture.setHue(this.effects.hue);
    this.imageTexture.setData();
  }
}
