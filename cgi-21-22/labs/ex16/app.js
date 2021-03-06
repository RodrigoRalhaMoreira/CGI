import * as UTILS from '../../libs/utils.js';
import * as MV from '../../libs/MV.js'

/** @type {WebGLRenderingContext} */
let gl;
const table_width = 3.0;
let table_height;
let grid_spacing = 0.05;
let vertices = [];
var program;
var tw;
var th;

function animate(time)
{
    // No proximo refrescamente quero que esta funcao seja chamada
    window.requestAnimationFrame(animate);

    // Drawing code
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.uniform1f(tw, table_width);
    gl.uniform1f(th, table_height);
    gl.drawArrays(gl.POINTS, 0, vertices.length);
}

function setup(shaders)
{
    const canvas = document.getElementById("gl-canvas");
    gl = UTILS.setupWebGL(canvas);

    program = UTILS.buildProgramFromSources(gl, shaders["shader.vert"], shaders["shader.frag"]);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    table_height = table_width * canvas.height / canvas.width;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    for(let x = -1.5; x <= 1.5; x += grid_spacing) {
        for(let y = -table_height/2; y <= table_height/2; y += grid_spacing) {
            vertices.push(MV.vec2(x,y));
        }
    }

    const aBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, MV.flatten(vertices), gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    tw = gl.getUniformLocation(program, "table_width");
    th = gl.getUniformLocation(program, "table_height");

    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        table_height = table_width * canvas.height / canvas.width;
        gl.viewport(0,0,gl.canvas.width, gl.canvas.height);
     });

    canvas.addEventListener("click", function(event) {
        // Start by getting x and y coordinates inside the canvas element
        var centralX = canvas.width/2;
        var centralY = canvas.height/2;
        
        var x = event.offsetX;
        var y = event.offsetY;
        
        if(x < centralX) {
            x = (-centralX + event.offsetX) * (-table_width/2) / (-centralX);
        }
        else {
            x = event.offsetX * (table_width/2) / (2*centralX); 
        }
        
        if(y < centralY) {
            y = (centralY - event.offsetY) * (table_height/2) / (centralY);
        }
        else {
            y = event.offsetY * (-table_height/2) / (2*centralY); 
        }

        console.log("Click at (" + x + ", " + y + ")");
    });

    window.requestAnimationFrame(animate);
}

UTILS.loadShadersFromURLS(["shader.vert", "shader.frag"]).then(s => setup(s));
