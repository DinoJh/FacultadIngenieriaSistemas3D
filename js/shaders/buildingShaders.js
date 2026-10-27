/** Shaders GLSL ES 3.00: materiales, normales, sombras dinámicas y Blinn-Phong. */
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
precision mediump int;
precision lowp sampler2D;
precision lowp sampler2DShadow;

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

// Iluminación Solar / Lunar
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform vec3 uAmbientColor;

// Sombras Proyectadas (Shadow Mapping)
uniform mat4 uLightSpaceMatrix;
uniform sampler2DShadow uShadowMap;
uniform float uShadowIntensity;

// Focos Dicroicos Empotrados Múltiples (Soffit y Pórtico)
#define MAX_LUCES 7
uniform int uNumLuces;
uniform vec3 uLuzPos[MAX_LUCES];
uniform vec3 uLuzColor[MAX_LUCES];
uniform float uLuzIntensidad[MAX_LUCES];
uniform float uLuzRadio[MAX_LUCES];

out vec4 fragColor;

float calcularSombra(vec3 worldPos, vec3 N, vec3 L) {
    if (uShadowIntensity <= 0.01) return 0.0;

    vec4 lightSpacePos = uLightSpaceMatrix * vec4(worldPos, 1.0);
    vec3 projCoords = lightSpacePos.xyz / lightSpacePos.w;
    projCoords = projCoords * 0.5 + 0.5;

    // Si está fuera del volumen ortográfico de la luz
    if (projCoords.z > 1.0 || projCoords.x < 0.0 || projCoords.x > 1.0 || projCoords.y < 0.0 || projCoords.y > 1.0) {
        return 0.0;
    }

    float cosTheta = max(dot(N, L), 0.0);
    // Cara en sombra propia (espalda a la luz)
    if (cosTheta <= 0.001) return 1.0 * uShadowIntensity;

    float bias = max(0.0035 * (1.0 - cosTheta), 0.0008);
    float currentDepth = projCoords.z - bias;

    // Filtrado PCF 3x3 para bordes suaves en las sombras del edificio y árboles
    float shadow = 0.0;
    vec2 texelSize = vec2(1.0 / 2048.0);
    for (int x = -1; x <= 1; ++x) {
        for (int y = -1; y <= 1; ++y) {
            vec3 coord = vec3(projCoords.xy + vec2(x, y) * texelSize, currentDepth);
            shadow += 1.0 - texture(uShadowMap, coord);
        }
    }
    shadow /= 9.0;
    return shadow * uShadowIntensity;
}

void main() {
    // Si la pieza es una fuente emisora directa (Sol, Luna, halos, texto neón o bombillas)
    if (uEmissive) {
        vec4 texColor = uUseTexture ? texture(uTexture, vTexCoord) : vec4(1.0);
        vec3 colorBase = texColor.rgb * uColor.rgb;
        float alfa = uColor.a * texColor.a;
        fragColor = vec4(colorBase * 1.35, alfa);
        return;
    }

    vec4 texColor = uUseTexture ? texture(uTexture, vTexCoord) : vec4(1.0);
    vec3 albedo = texColor.rgb * uColor.rgb;

    vec3 N = normalize(vNormal);
    vec3 V = normalize(uCameraPos - vWorldPos);

    // 1. Luz Ambiental Hemisférica (Cielo cenital vs Rebote del suelo)
    // Superficies mirando al cielo (+Y) reciben la luz ambiental de la bóveda celeste.
    // Superficies mirando hacia abajo (-Y) reciben el rebote atenuado y cálido del terreno.
    float factorHemi = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 ambientCielo = uAmbientColor;
    vec3 ambientSuelo = uAmbientColor * vec3(0.55, 0.50, 0.45) * 0.75;
    vec3 ambiente = mix(ambientSuelo, ambientCielo, factorHemi) * albedo;

    // 2. Luz Solar / Lunar Direccional con Sombras
    // L_sol apunta hacia la fuente de luz
    vec3 L_sol = normalize(-uSunDirection);
    float NdotL = max(dot(N, L_sol), 0.0);

    // Cálculo de sombra arrojada (Shadow Mapping con PCF)
    float factorSombra = calcularSombra(vWorldPos, N, L_sol);
    float factorLuzDirecta = NdotL * (1.0 - factorSombra);

    vec3 difusaSol = uSunColor * factorLuzDirecta * albedo;

    // Especular Blinn-Phong con efecto Fresnel (Schlick)
    vec3 H_sol = normalize(L_sol + V);
    float NdotH = max(dot(N, H_sol), 0.0);
    float specSol = pow(NdotH, max(uSpecularPower, 4.0));

    // Efecto Fresnel: a ángulos rasantes los vidrios y metales reflejan más luz
    float VdotH = max(dot(V, H_sol), 0.0);
    float fresnel = 0.04 + 0.96 * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
    float factorEspecular = uSpecularPower > 25.0 ? (0.35 + 0.50 * fresnel) : (0.08 + 0.12 * fresnel);
    vec3 especularSol = uSunColor * (specSol * (1.0 - factorSombra)) * factorEspecular;

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

    // 4. Composición Lumínica y Mapeo Tonal (Tonemapping)
    vec3 colorIluminado = ambiente + difusaSol + especularSol + luzDicroicosTotal;

    // Curva de mapeo tonal tipo Reinhard extendido para evitar quemado blanco
    vec3 colorMapeado = colorIluminado / (colorIluminado + vec3(0.75)) * 1.20;
    vec3 colorFinal = clamp(colorMapeado, 0.0, 1.0);

    fragColor = vec4(colorFinal, uColor.a * texColor.a);
}
`;
