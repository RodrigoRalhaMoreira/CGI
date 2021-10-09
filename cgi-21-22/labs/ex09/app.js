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

    program = buildProgramFromSources(gl, shaders["shader.vert"],shaders["shader.frag"]);

    const vertices = [
        vec2(-0.5,-0.5),
        vec2(0.5,-0.5),
        vec2(0,0.5)
    ];
    const colors = [
        vec4(-0.5,-0.5,0,1.0),
        vec4(0.5,-0.5),
        vec4(0,0.5)
    ];


    //criar os dois buffers 
    vBuffer = gl.createBuffer();
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Setup the viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Setup the background color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Call animate for the first time
    animate();
}

function animate()
{
    // No proximo refrescamente quero que esta funcao seja chamada
    window.requestAnimationFrame(animate);

    // Drawing code
    gl.clear(gl.COLOR_BUFFER_BIT);

    //no buffer dos vertices vou de 2 em 2 e no das cores de 4 em 4
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
//loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders));
setup(loadShadersFromScripts(["shader.vert", "shader.frag"]));