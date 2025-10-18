// ----------------- SHADERS -----------------
const vsSrc = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fsSrc = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform vec2 u_center;
uniform float u_radius;
uniform vec3 u_color;

void main() {
    float d = distance(v_uv, u_center);
    float edge = 0.6; // soft blur  
    float alpha = 1.0 - smoothstep(u_radius - edge, u_radius + edge, d);    

    vec3 finalColor = u_color;
    outColor = vec4(finalColor, alpha);    
}
`;




// ----------------- BLOB SETUP -----------------
const numBlobs = 3;
const blobs = [];

for (let i = 0; i < numBlobs; i++) {
    blobs.push({
        center: [Math.random(), Math.random()],
        radius: 0.05 + Math.random() * 0.1,
        // radius: 0.1,
        velocity: [Math.random() * 0.001, Math.random() * 0.001],
        color: [Math.random(), Math.random(), Math.random()] // RGB
    });
}


// ----------------- ANIMATION LOOP -----------------
function animateBlobs(gl, program) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(1.0, 0.988, 0.933, 1.0);
    
    
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let blob of blobs) {
        blob.center[0] += blob.velocity[0];
        blob.center[1] += blob.velocity[1];

        if (blob.center[0] < 0 || blob.center[0] > 1) blob.velocity[0] *= -1;
        if (blob.center[1] < 0 || blob.center[1] > 1) blob.velocity[1] *= -1;

        setCircleUniforms(gl, program, blob.center, blob.radius, blob.color);        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    requestAnimationFrame(() => animateBlobs(gl, program));
}



// start here
function main() {
    const canvas = document.getElementById('gl-canvas');
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;


    const {gl, program} = initGL("gl-canvas");
    // Optionally enable additive blending for overlapping blobs
    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    createFullscreenQuad(gl, program);
    


    // Start the blob animation
    animateBlobs(gl, program);

    

}


main()




//  ========================================================================================================================
//  ========================================================================================================================
//  ========================================================================================================================


// ----------------- GL INIT -----------------
function initGL(canvasId) {
    const canvas = document.getElementById(canvasId);
    // canvas.width = 100;
    // canvas.height = 100;

    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error("WebGL2 not supported");

    // Compile shaders
    function compileShader(type, src) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw new Error(gl.getShaderInfoLog(shader));
        return shader;
    }

    const program = gl.createProgram();
    const vs = compileShader(gl.VERTEX_SHADER, vsSrc);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSrc);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(program));

    gl.useProgram(program);

    return { gl, program, canvas };
}


// ----------------- FULLSCREEN QUAD -----------------
function createFullscreenQuad(gl, program) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1,-1,  1,-1, -1,1,
        -1,1,   1,-1, 1,1
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
}


// ----------------- UNIFORM HELPERS -----------------
function setCircleUniforms(gl, program, center, radius, color) {
    const uCenter = gl.getUniformLocation(program, "u_center");
    const uRadius = gl.getUniformLocation(program, "u_radius");
    const uColor = gl.getUniformLocation(program, "u_color");

    gl.uniform2fv(uCenter, center);
    gl.uniform1f(uRadius, radius);
    gl.uniform3fv(uColor, color);
}


// ----------------- RENDER -----------------
// function render(gl) {
//     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
//     gl.clearColor(0.0, 0.9, 0.3, 1.0); // nice dark blue
//     gl.clear(gl.COLOR_BUFFER_BIT);
//     gl.drawArrays(gl.TRIANGLES, 0, 6);
// }
