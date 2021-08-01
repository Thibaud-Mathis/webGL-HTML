varying float v_noise;
varying vec2 v_uv;

uniform float time;
uniform float hoverState;
uniform sampler2D u_image;

void main() {
    // vec3 color1 = vec3(0. ,1., 0.2);
    // vec3 color2 = vec3(0. ,1., 1.);
    // vec3 finalColor = mix(color1, color2, 0.5 * (v_noise + 1.));

    vec2 newUV = v_uv;
    vec4 catView = texture2D(u_image, newUV);


    // gl_FragColor = vec4();
    gl_FragColor = catView;
    gl_FragColor.rgb += hoverState * 1. * vec3(0.1, 0.1, 0.2);
    gl_FragColor.rgb += 0.01 * v_noise;
    // gl_FragColor = vec4(v_noise, 0., 0., 1.);

}