attribute vec4 vPosition;

void main()
{
    gl_PointSize = 4.0;
    gl_Position = vPosition / vec4(tablewidth/2, tableheight/2,1,1);
}
