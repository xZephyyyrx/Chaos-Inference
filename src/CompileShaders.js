export default class CompileShaders {
    static #positions = [
        -1, -1,
        1, -1,
        -1,  1,
        -1,  1,
        1, -1,
        1,  1
    ];

    static initializeShaders(canvas, gl, vertexCode, fragmentCode) {

        // Create and Compile Shaders
        let vertexShader;
        let fragmentShader;

        try {
            vertexShader = CompileShaders.createShader(gl, gl.VERTEX_SHADER, vertexCode);
        } catch (error) {
            throw error;
        }

        try {
            fragmentShader = CompileShaders.createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)
        } catch (error) {
            throw error;
        }

        // Initialize Program
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program));
        }

        gl.useProgram(program);

        // Passes the screen resolution as a uniform
        const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

        // Enable canvas blending
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Allocate Memory
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(CompileShaders.#positions), gl.STATIC_DRAW);
    
        const positionLocation = gl.getAttribLocation(program, 'a_position');

        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    static createShader(gl, type, source) {

        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }

        return shader;
    }
}