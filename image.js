const uploadButton = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("effect-slider");

let img = new Image();
let effects = {
    brightness: 1,
    saturation: 1,
    contrast: 1,
    sepia: 0,
    greyscale: 0,
    invert: 0,
    blur: 0,
};
let rotationAngle = 0;
let flipX = 1;
let flipY = 1;

uploadButton.addEventListener("change", function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        img.onload = function() {
            const scaleFactor = Math.min(400 / img.height, 400 / img.width, 1);
            canvas.width = img.width * scaleFactor;
            canvas.height = img.height * scaleFactor;

            resetAllEffects(); // Reset effects on new image load
            drawImage();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function applyEffect(effect) {
    slider.style.display = effect === "rotate" || effect === "flip" ? "none" : "block";

    slider.oninput = () => {
        effects[effect] = slider.value / 100;
        drawImage();
    };

    if (effect === "rotate") {
        rotationAngle = (rotationAngle + 90) % 360;
    }
    if (effect === "flip") {
        flipX *= -1;
    }

    slider.value = effects[effect] * 100 || 100;
    drawImage();
}

function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const filter = `
        brightness(${effects.brightness}) 
        saturate(${effects.saturation}) 
        contrast(${effects.contrast}) 
        sepia(${effects.sepia}) 
        grayscale(${effects.greyscale}) 
        invert(${effects.invert}) 
        blur(${effects.blur * 10}px)
    `;

    ctx.filter = filter;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(flipX, flipY);
    ctx.rotate((rotationAngle * Math.PI) / 180);
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();
}

function resetAllEffects() {
    effects = {
        brightness: 1,
        saturation: 1,
        contrast: 1,
        sepia: 0,
        greyscale: 0,
        invert: 0,
        blur: 0,
    };
    rotationAngle = 0;
    flipX = 1;
    flipY = 1;
    drawImage();
}

function downloadImage() {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL();
    link.click();
}
