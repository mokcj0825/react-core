# Architecture Test Cases

This directory contains test cases for the architecture system. Each test case is organized in its own directory with a specific structure.

## Directory Structure

```
public/architecture/
├── test-case-001/
│   ├── init.json
│   ├── town-init.json
│   ├── town-0001.json
│   ├── town-0001.ts
│   └── ...
├── test-case-002/
│   └── ...
└── README.md
```

## Initialization

Each test case must have an `init.json` file that serves as the entry point. The `init.json` file must contain exactly one command, either `INVOKE_SCENE` or `INVOKE_SCRIPT`.

### INVOKE_SCENE Command

```json
{
    "command": "INVOKE_SCENE",
    "scene": "town",
    "sceneResource": "town-init.json"
}
```

Parameters:
- `scene`: The scene to invoke (must be one of: 'homeScreen', 'chat', 'town', 'deployment', 'battlefield', 'inventory')
- `sceneResource`: The JSON file to load for the scene initialization

### INVOKE_SCRIPT Command

```json
{
    "command": "INVOKE_SCRIPT",
    "script": "town-0001.ts",
    "entryPoint": "main"
}
```

Parameters:
- `script`: The TypeScript file to execute
- `entryPoint`: The function name to call in the script

## Notes

- Each test case directory should be self-contained with all its required resources
- Script files (.ts) should export their entry point functions
- Scene resource files (.json) should contain the scene-specific configuration
- The system will automatically load the correct test case based on the selection in the control panel
