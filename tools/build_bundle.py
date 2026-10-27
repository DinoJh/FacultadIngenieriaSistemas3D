"""Empaqueta los módulos locales para abrir index.html con doble clic.

Soporta los imports nombrados y exports de declaración usados por este proyecto.
No requiere paquetes externos. Los archivos fuente siguen siendo módulos ES.
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
IMPORT = re.compile(r"^import\s*\{([^}]+)\}\s*from\s*['\"]([^'\"]+)['\"];?", re.MULTILINE)
EXPORT = re.compile(r'^export\s+(class|function|const|let)\s+(\w+)', re.MULTILINE)


def build():
    modules = {}
    visiting = set()

    def visit(path):
        path = path.resolve()
        key = path.relative_to(ROOT).as_posix()
        if key in visiting:
            raise ValueError(f'Dependencia circular no soportada: {key}')
        if key in modules:
            return key
        visiting.add(key)
        source = path.read_text(encoding='utf-8')

        def resolve_import(match):
            dependency = visit(path.parent / match[2])
            bindings = re.sub(r'\s+as\s+', ': ', match[1].strip())
            return f'const {{ {bindings} }} = modules[{json.dumps(dependency)}];'

        source = IMPORT.sub(resolve_import, source)
        names = [match[2] for match in EXPORT.finditer(source)]
        source = EXPORT.sub(r'\1 \2', source)
        modules[key] = (source, names)
        visiting.remove(key)
        return key

    visit(ROOT / 'js/main.js')
    result = [
        '// GENERADO por tools/build_bundle.py. Editar los módulos fuente y regenerar.',
        '// Conserva cada módulo en su propio ámbito; funciona también desde file://.',
        "(() => {\n'use strict';\nconst modules = Object.create(null);\ntry {"
    ]
    for key, (source, names) in modules.items():
        result.append(f'\n// --- {key} ---\nmodules[{json.dumps(key)}] = (() => {{\n{source}\nreturn {{ {", ".join(names)} }};\n}})();')
    result.append('''
} catch (error) {
    console.error('No se pudo iniciar la escena:', error);
    const panel = document.createElement('section');
    panel.className = 'startup-message';
    panel.setAttribute('role', 'alert');
    panel.textContent = 'No se pudo cargar la escena 3D: ' + error.message;
    document.body.append(panel);
}
})();
''')
    output = ROOT / 'js/app.bundle.js'
    output.write_text('\n'.join(result), encoding='utf-8')
    print(f'Generado {output.name}: {len(modules)} modulos.')


if __name__ == '__main__':
    build()
