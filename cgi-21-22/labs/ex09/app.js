import { loadShadersFromURLS, loadShadersFromScripts, setupWebGL, buildProgramFromSources } from "../../libs/utils.js";
import { vec2, vec4, flatten } from"../../libs/MV.js";

/** @type {WebGLRenderingContext}*/
var gl;
var program;
var vBuffer;
var cBuffer;

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
        vec2(-0.5,-0.5),
        vec2(0.5,-0.5),
        vec2(0,0.5)
    ];
    const colors = [
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0)
    ];

    //criar os dois buffers 
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // Call animate for the first time
    animate();
}   

function animate()
{
    // No proximo refrescamente quero que esta funcao seja chamada
    window.requestAnimationFrame(animate);

    // Drawing code
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders));
//setup(loadShadersFromScripts(["shader.vert", "shader.frag"]));