const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");

const addTextBtn = document.getElementById("addTextBtn");
const deleteTextBtn = document.getElementById("deleteTextBtn");
const textInput = document.getElementById("textInput");
const fontSizeInput = document.getElementById("fontSize");
const textColorInput = document.getElementById("textColor");
const outlineColorInput = document.getElementById("outlineColor");
const fontFamilyInput = document.getElementById("fontFamily");
const downloadBtn = document.getElementById("downloadBtn");

const selectedMeme = JSON.parse(
    localStorage.getItem("selectedMeme")
);

const uploadedImage = localStorage.getItem(
    "uploadedImage"
);

const image = new Image();
image.crossOrigin = "anonymous";

if (uploadedImage) {
    image.src = uploadedImage;
}
else if (selectedMeme) {
    image.src = selectedMeme.url;
}
else {
    alert("No image selected!");
    window.location.href = "index.html";
}

let layers = [];
let selectedLayer = null;

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

image.onload = () => {

    canvas.width = image.width;
    canvas.height = image.height;

    render();
};

function render() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
    );

    layers.forEach((layer, index) => {

        ctx.font =
            `bold ${layer.fontSize}px ${layer.fontFamily}`;

        ctx.fillStyle =
            layer.textColor;

        ctx.strokeStyle =
            layer.outlineColor;

        ctx.lineWidth = 4;

        ctx.textAlign = "left";

        ctx.strokeText(
            layer.text,
            layer.x,
            layer.y
        );

        ctx.fillText(
            layer.text,
            layer.x,
            layer.y
        );

        if (index === selectedLayer) {

            const width =
                ctx.measureText(layer.text).width;

            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 2;

            ctx.strokeRect(
                layer.x - 5,
                layer.y - layer.fontSize,
                width + 10,
                layer.fontSize + 10
            );
        }
    });
}

addTextBtn.addEventListener(
    "click",
    () => {

        layers.push({

            text: "New Text",

            x: canvas.width / 2,

            y: canvas.height / 2,

            fontSize:
                Number(fontSizeInput.value),

            textColor:
                textColorInput.value,

            outlineColor:
                outlineColorInput.value,

            fontFamily:
                fontFamilyInput.value
        });

        selectedLayer =
            layers.length - 1;

        updateControls();

        render();
    }
);

function updateControls() {

    if (selectedLayer === null) return;

    const layer =
        layers[selectedLayer];

    textInput.value =
        layer.text;

    fontSizeInput.value =
        layer.fontSize;

    textColorInput.value =
        layer.textColor;

    outlineColorInput.value =
        layer.outlineColor;

    fontFamilyInput.value =
        layer.fontFamily;
}

textInput.addEventListener(
    "input",
    () => {

        if (selectedLayer === null)
            return;

        layers[selectedLayer].text =
            textInput.value;

        render();
    }
);

fontSizeInput.addEventListener(
    "input",
    () => {

        if (selectedLayer === null)
            return;

        layers[selectedLayer].fontSize =
            Number(fontSizeInput.value);

        render();
    }
);

textColorInput.addEventListener(
    "input",
    () => {

        if (selectedLayer === null)
            return;

        layers[selectedLayer].textColor =
            textColorInput.value;

        render();
    }
);

outlineColorInput.addEventListener(
    "input",
    () => {

        if (selectedLayer === null)
            return;

        layers[selectedLayer].outlineColor =
            outlineColorInput.value;

        render();
    }
);

fontFamilyInput.addEventListener(
    "change",
    () => {

        if (selectedLayer === null)
            return;

        layers[selectedLayer].fontFamily =
            fontFamilyInput.value;

        render();
    }
);

deleteTextBtn.addEventListener(
    "click",
    () => {

        if (selectedLayer === null)
            return;

        layers.splice(
            selectedLayer,
            1
        );

        selectedLayer = null;

        textInput.value = "";

        render();
    }
);

canvas.addEventListener(
    "mousedown",
    (e) => {

        const rect =
            canvas.getBoundingClientRect();

        const scaleX =
            canvas.width / rect.width;

        const scaleY =
            canvas.height / rect.height;

        const mouseX =
            (e.clientX - rect.left)
            * scaleX;

        const mouseY =
            (e.clientY - rect.top)
            * scaleY;

        selectedLayer = null;

        for (
            let i =
            layers.length - 1;
            i >= 0;
            i--
        ) {

            const layer =
                layers[i];

            ctx.font =
                `bold ${layer.fontSize}px ${layer.fontFamily}`;

            const width =
                ctx.measureText(
                    layer.text
                ).width;

            const height =
                layer.fontSize;

            if (
                mouseX >= layer.x &&
                mouseX <= layer.x + width &&
                mouseY >= layer.y - height &&
                mouseY <= layer.y
            ) {

                selectedLayer = i;

                dragOffsetX =
                    mouseX - layer.x;

                dragOffsetY =
                    mouseY - layer.y;

                isDragging = true;

                updateControls();

                break;
            }
        }

        render();
    }
);

canvas.addEventListener(
    "mousemove",
    (e) => {

        if (
            !isDragging ||
            selectedLayer === null
        ) return;

        const rect =
            canvas.getBoundingClientRect();

        const scaleX =
            canvas.width / rect.width;

        const scaleY =
            canvas.height / rect.height;

        const mouseX =
            (e.clientX - rect.left)
            * scaleX;

        const mouseY =
            (e.clientY - rect.top)
            * scaleY;

        layers[selectedLayer].x =
            mouseX - dragOffsetX;

        layers[selectedLayer].y =
            mouseY - dragOffsetY;

        render();
    }
);

canvas.addEventListener(
    "mouseup",
    () => {

        isDragging = false;
    }
);

canvas.addEventListener(
    "mouseleave",
    () => {

        isDragging = false;
    }
);

downloadBtn.addEventListener(
    "click",
    () => {

        const link =
            document.createElement("a");

        link.download =
            "meme.png";

        link.href =
            canvas.toDataURL(
                "image/png"
            );

        link.click();
    }
);