import { loadShadersFromURLS, loadShadersFromScripts, setupWebGL, buildProgramFromSources } from "../../libs/utils.js";
import { vec2, vec4, flatten, sizeof } from"../../libs/MV.js";

/** @type {WebGLRenderingContext}*/
var gl;
var program;
var oneBuffer;

function setup(shaders)
{
    // Setup
    const canvas = document.getElementById("gl-canvas");
    gl = setupWebGL(canvas);

    // Setup the background color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Setup the viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    program = buildProgramFromSources(gl, shaders["shader.vert"],shaders["shader.frag"]);

    const vertices = [
        vec4(1.0, 0.0, 0.0, 1.0),
        vec2(-0.5,-0.5),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec2(0.5,-0.5),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec2(0.0, 0.5)
    ];

    /* a outra maneira 
    
        const vertices = [
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec2(-0.5,-0.5),
        vec2(0.5,-0.5),
        vec2(0.0, 0.5)
    ];
    */ 

    //criar apenas 1 buffer 
    oneBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, oneBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    console.log(flatten(vertices))
    // Call animate for the first time
    animate();
}   

function animate()
{
    // No proximo refrescamente quero que esta funcao seja chamada
    window.requestAnimationFrame(animate);

    // Drawing code
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, oneBuffer);

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 24, 16);
    
    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 24, 0);
    
    /* A outra maneira com a outra maneira do vetor
    
    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 48);
    
    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    */ 

    gl.enableVertexAttribArray(vPosition);
    gl.enableVertexAttribArray(vColor);

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders));
//setup(loadShadersFromScripts(["shader.vert", "shader.frag"]));