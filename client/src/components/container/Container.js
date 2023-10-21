import React from "react";
import './styles.css'
import io from "socket.io-client";

class Container extends React.Component{

    socket = io("http://localhost:5000");

    constructor(props) {
        super(props);

        this.socket.on("update-canvas", function(data){
            
            var interval = setInterval(function(){
                clearInterval(interval);
                var image = new Image();
                var canvas = document.querySelector('canvas');
                var ctx = canvas.getContext("2d");
                image.onload = function() {
                    ctx.drawImage(image, 0, 0);
                };
                image.src = data;
            }, 200)
        })
    }

    componentDidMount() {
        this.drawCanvas();
    }

    drawCanvas(){
        const canvas = document.querySelector("canvas");
        const toolBtns = document.querySelectorAll(".tool");
        const sizeSlider = document.querySelector("#size-slider");
        const colorPicker = document.querySelector("#color-picker");
        const saveImg = document.querySelector(".save-img");
        const ctx = canvas.getContext("2d");


        const emitforSocket = () => {
            var root = this;

            if(root.timeout !== undefined) clearTimeout(root.timeout);
                root.timeout = setTimeout(function(){
                    var base64ImageData = canvas.toDataURL("image/png");
                    root.socket.emit("update-canvas", base64ImageData);
                }, 1000)
        }


        let isDrawing = false,
            selectedTool = "brush",
            selectedColor = "#000000",
            brushWidth = 4,
            prevMouseX, 
            prevMouseY;

        window.addEventListener("load", () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });

        const drawRect = (e) => {
            ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY); 
            emitforSocket();
        }

        const drawCircle = (e) => {
            ctx.beginPath();
            let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
            ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
            ctx.fill();
            emitforSocket();
        }

        const drawTriangle = (e) => {
            ctx.beginPath();
            ctx.moveTo(prevMouseX, prevMouseY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
            ctx.closePath();
            ctx.fill();
            emitforSocket();
        }

        const startDraw = (e) => {
            isDrawing = true;
            prevMouseX = e.offsetX;
            prevMouseY = e.offsetY;
            ctx.beginPath();
            ctx.lineWidth = brushWidth;
            ctx.strokeStyle = selectedColor;
            ctx.fillStyle = selectedColor;
        }

        const drawing = (e) => {
            if (!isDrawing) return;

            if (selectedTool === "brush" || selectedTool === "eraser") {
                ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
                emitforSocket();
            } 
            else if (selectedTool === "rectangle") {
                drawRect(e);
            } else if (selectedTool === "circle") {
                drawCircle(e);
            } else {
                drawTriangle(e);
            }
        }

        toolBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelector(".options .active").classList.remove("active");
                btn.classList.add("active");
                selectedTool = btn.id;
            });
        });

        sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

        colorPicker.addEventListener("change", () => { selectedColor = colorPicker.value});

        saveImg.addEventListener("click", () => {
            const link = document.createElement("a");
            link.download = `${Date.now()}.jpeg`;
            link.href = canvas.toDataURL();
            link.click();
        });

        canvas.addEventListener("mousedown", startDraw);
        canvas.addEventListener("mousemove", drawing);
        canvas.addEventListener("mouseup", () => isDrawing = false);
    }
    

    render(){
        return(
            <div class="container">
                <section class="tools-board">
                    <div class="row">
                        <label class="title">Shapes</label>
                        <ul class="options">
                            <li class="option tool" id="triangle">
                                <span>Triangle</span>
                            </li>
                            <li class="option tool" id="rectangle">
                                <span>Rectangle</span>
                            </li>
                            <li class="option tool" id="circle">
                                <span>Circle</span>
                            </li>
                        </ul>
                    </div>
                    <div class="row">
                        <label class="title">Options</label>
                        <ul class="options">
                            <li class="option active tool" id="brush">
                                <span>Brush</span>
                            </li>
                            <li class="option tool" id="eraser">
                                <span>Eraser</span>
                            </li>
                            <li class="option">
                                <input type="range" id="size-slider" min="1" max="30" value={this.brushWidth}/>
                            </li>
                        </ul>
                    </div>
                    <div class="row color">
                        <label class="title">Color</label>
                        <input type="color" id="color-picker" class="picker" value={this.selectedColor} />
                    </div>
                    <div class="row buttons">
                        <button class="save-img">Export to JPEG</button>
                    </div>
                </section>
                <section class="drawing-board">
                    <canvas></canvas>
                </section>
            </div>
        )
    }
}


export default Container;