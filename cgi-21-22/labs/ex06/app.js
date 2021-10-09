import { loadShadersFromURLS, loadShadersFromScripts, setupWebGL, buildProgramFromSources } from "../../libs/utils.js";
import { vec2, flatten } from"../../libs/MV.js";

/** @type {WebGLRenderingContext}*/
var gl;
var program;
var vertices = [];
var nvertices = 500;
var ntriangles = 2;
function setup(shaders)
{
    // Setup
    const canvas = document.getElementById("gl-canvas");
    gl = setupWebGL(canvas);

    program = buildProgramFromSources(gl, shaders["shader.vert"],shaders["shader.frag"]);

    for (let i = 0; i < nvertices; i++) {
        let x = Math.random();
        let y = Math.random();
        vertices.push(vec2((x-0.5)*2,(y-0.5)*2));
    }

    const aBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
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

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3*ntriangles);
}
//loadShadersFromURLS(["shader.vert", "shader.frag"]).then(shaders => setup(shaders));
setup(loadShadersFromScripts(["shader.vert", "shader.frag"]));