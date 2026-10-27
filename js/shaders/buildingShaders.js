/** Shaders GLSL ES 3.00: materiales, normales e iluminación Blinn-Phong. */
export const vertexShaderSource = `#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

out vec3 vWorldPos;
out vec3 vNormal;
out vec2 vTexCoord;

void main() {
    vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;

    vNormal = normalize(uNormalMatrix * aNormal);
    vTexCoord = aTexCoord;
}
`;

export const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 vWorldPos;
in vec3 vNormal;
in vec2 vTexCoord;

// Uniforms de Material
uniform sampler2D uTexture;
uniform bool uUseTexture;
uniform vec4 uColor;
uniform bool uEmissive;
uniform float uSpecularPower;

// Uniforms de Cámara
uniform vec3 uCameraPos;

// Iluminación Solar
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform vec3 uAmbientColor;

// Focos Dicroicos Empotrados Múltiples (Soffit y Pórtico)
#define MAX_LUCES 7
uniform int uNumLuces;
uniform vec3 uLuzPos[MAX_LUCES];
uniform vec3 uLuzColor[MAX_LUCES];
uniform float uLuzIntensidad[MAX_LUCES];
uniform float uLuzRadio[MAX_LUCES];

out vec4 fragColor;

void main() {
    // Si la pieza es una fuente emisora directa (dicroico encendido o texto neón)
    if (uEmissive) {
        vec3 colorBase = uUseTexture ? texture(uTexture, vTexCoord).rgb : uColor.rgb;
        fragColor = vec4(colorBase * 1.5, 1.0);
        return;
    }

    vec4 texColor = uUseTexture ? texture(uTexture, vTexCoord) : vec4(1.0);
    vec3 albedo = texColor.rgb * uColor.rgb;

    vec3 N = normalize(vNormal);
    vec3 V = normalize(uCameraPos - vWorldPos);

    // 1. Luz Ambiental
    vec3 ambiente = uAmbientColor * albedo;

    // 2. Luz Solar Direccional
    vec3 L_sol = normalize(-uSunDirection);
    float diffSol = max(dot(N, L_sol), 0.0);
    vec3 difusaSol = uSunColor * diffSol * albedo;

    vec3 H_sol = normalize(L_sol + V);
    float specSol = pow(max(dot(N, H_sol), 0.0), uSpecularPower);
    vec3 especularSol = uSunColor * specSol * (uSpecularPower > 25.0 ? 0.35 : 0.08);

    // 3. Focos Dicroicos Empotrados (Cálculo acumulativo con atenuación cuadrática suave)
    vec3 luzDicroicosTotal = vec3(0.0);

    for (int i = 0; i < uNumLuces; i++) {
        vec3 L_vec = uLuzPos[i] - vWorldPos;
        float dist = length(L_vec);

        if (dist < uLuzRadio[i]) {
            vec3 L = normalize(L_vec);
            // Mayor intensidad cuando la luz apunta hacia abajo (-Y)
            float factorCono = clamp(dot(L, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5, 0.2, 1.0);

            float diff = max(dot(N, L), 0.0);
            float factorDist = clamp(1.0 - dist / uLuzRadio[i], 0.0, 1.0);
            float aten = factorDist * factorDist * factorCono;

            vec3 H = normalize(L + V);
            float spec = pow(max(dot(N, H), 0.0), uSpecularPower);

            vec3 difusa = uLuzColor[i] * (diff * aten * uLuzIntensidad[i]) * albedo;
            vec3 especular = uLuzColor[i] * (spec * aten * uLuzIntensidad[i] * 0.25);

            luzDicroicosTotal += (difusa + especular);
        }
    }

    vec3 colorFinal = ambiente + difusaSol + especularSol + luzDicroicosTotal;
    fragColor = vec4(colorFinal, uColor.a * texColor.a);
}
`;

