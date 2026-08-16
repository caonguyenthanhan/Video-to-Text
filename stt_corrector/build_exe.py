import PyInstaller.__main__

def build_executable():
    PyInstaller.__main__.run([
        'main.py',
        '--name=AI_STT_Corrector',
        '--onefile',
        '--hidden-import=langchain',
        '--hidden-import=langchain_core',
        '--hidden-import=langchain_community',
        '--hidden-import=pydantic',
        '--hidden-import=pydantic_settings',
        '--hidden-import=uvicorn',
        '--hidden-import=fastapi',
        '--hidden-import=llama_cpp',
        '--exclude-module=PyQt5',
        '--exclude-module=PyQt6',
        '--exclude-module=PySide2',
        '--exclude-module=PySide6',
        '--add-data=.env;.',
        '--clean',
        '--noconfirm'
    ])

if __name__ == "__main__":
    build_executable()
