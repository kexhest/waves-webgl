precision highp float;

uniform sampler2D texture;
uniform float time;
uniform float delimiter;
uniform vec2 resolution;

varying vec2 texCoord;

float PI = 3.1415926536;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  if (uv.y > delimiter) {
    gl_FragColor = texture2D(texture, texCoord);
  } else {
    float xoffset = ((0.3 - uv.y) / 0.3) * 0.005 * cos(time * PI + 400.0 * uv.y);
    float yoffset = ((0.3 - uv.y) / 0.3) * 0.005 * (1.0 + cos(time * PI + 50.0 * uv.y));

    gl_FragColor = texture2D(texture, vec2(uv.x + xoffset , (1.0 - uv.y + yoffset)));
  }
}
