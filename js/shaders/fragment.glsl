varying float v_noise;
varying vec2 v_uv;

void main() {
    vec3 color1 = vec3(0. ,1., 0.2);
    vec3 color2 = vec3(0. ,1., 1.);
    vec3 finalColor = mix(color1, color2, 0.5 * (v_noise + 1.));

    // gl_FragColor = vec4();
    gl_FragColor = vec4(finalColor, 1.);
    // gl_FragColor = vec4(v_uv, 0., 1.);

}