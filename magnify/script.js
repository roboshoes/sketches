var canvas = document.getElementById( "canvas" );
var gl = canvas.getContext( "webgl" ) || canvas.getContext( "experimental-webgl" );

gl.getExtension( "OES_standard_derivatives" );
gl.getExtension( "EXT_shader_texture_lod" );

gl.clearColor( 0, 0, 0, 1 );
gl.disable( gl.DEPTH_TEST );

var vertexShaderSource = document.getElementById( "vertex" ).innerText;
var fragmentShaderSource = document.getElementById( "fragment" ).innerText;

function compileShader( gl, source, type ) {
    var shader = gl.createShader( type );

    gl.shaderSource( shader, source );
    gl.compileShader( shader );

    if ( ! gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
        console.error( gl.getShaderInfoLog( shader ) );

        gl.deleteShader( shader );

        return null;
    }

    return shader;
}

function makeProgram( gl, vertexShader, fragmentShader ) {
    var program = gl.createProgram();

    gl.attachShader( program, vertexShader );
    gl.attachShader( program, fragmentShader );
    gl.linkProgram( program );
    gl.validateProgram( program );

    if ( ! gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
        console.error( gl.getProgramInfoLog( program ) );
    }

    gl.useProgram( program );

    return program;
}

function makeVertexBuffer( gl ) {
    var buffer = gl.createBuffer();
    var vertices = [
         1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
        -1.0, -1.0,
    ];

    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

    return buffer;
}

function makeTexture( gl, image ) {
    var texture = gl.createTexture();

    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.bindTexture( gl.TEXTURE_2D, null );

    return texture;
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gl.viewport( 0, 0, window.innerWidth, window.innerHeight );
}

function onMouseMove( event ) {
    mouse.x = event.pageX;
    mouse.y = window.innerHeight - event.pageY;
}

// --------------

var vertexBuffer;
var vertexLocation;
var resolutionLocation;
var textureLocation;
var mouseLocation;
var texture;
var mouse = { x: 0.5, y: 0.5 };

function init() {

    window.addEventListener( "resize", resize );
    window.addEventListener( "mousemove", onMouseMove );

    var vertexShader = compileShader( gl, vertexShaderSource, gl.VERTEX_SHADER );
    var fragmentShader = compileShader( gl, fragmentShaderSource, gl.FRAGMENT_SHADER );

    var program = makeProgram( gl, vertexShader, fragmentShader );

    vertexLocation = gl.getAttribLocation( program, "aPosition" );
    vertexBuffer = makeVertexBuffer( gl );
    texture = makeTexture( gl, createMap() );

    uniformLocation = gl.getUniformLocation( program, "uResolution" );
    mouseLocation = gl.getUniformLocation( program, "uMouse" );
    resolutionLocation = gl.getUniformLocation( program, "uTexture" );

    gl.enableVertexAttribArray( vertexLocation );
}

function createMap() {
    var canvas = document.createElement( "canvas" );
    var context = canvas.getContext( "2d" );

    canvas.width = 1024;
    canvas.height = 1024;

    context.fillStyle = "red";
    context.fillRect( 0, 0, 10, 10 );
    context.fillRect( 1014, 1014, 10, 10 );
    context.fillRect( 0, 1014, 10, 10 );
    context.fillRect( 1014, 0, 10, 10 );

    return canvas;
}

function loop() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
    gl.vertexAttribPointer( vertexLocation, 2, gl.FLOAT, gl.FALSE, 0, 0 );

    gl.uniform2f( mouseLocation, mouse.x, mouse.y );

    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.uniform1i( textureLocation, 0 );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    requestAnimationFrame( loop );
}

init();
resize();
loop();