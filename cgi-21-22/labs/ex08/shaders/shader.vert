uniform float dx;
attribute vec4 vPosition;

void main()
{
    gl_Position = vPosition + vec4(dx, 0.0, 0.0, 0.0);
    // gl_Position = vPosition;
    // gl_Position.x += dx;
}