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

## Chat System Features

### Event Commands

The chat system supports several event commands in JSON files:

#### SHOW_MESSAGE Command
```json
{
    "eventCommand": "SHOW_MESSAGE",
    "characterName": "Character Name",
    "message": "Message content with formatting"
}
```

#### WRITE_CONSOLE Command
```json
{
    "eventCommand": "WRITE_CONSOLE",
    "message": "Console message",
    "type": "info|warning|error"
}
```

#### REQUEST_INPUT Command
```json
{
    "eventCommand": "REQUEST_INPUT",
    "inputType": "string|number",
    "targetField": "playerName",
    "confirmMessage": "你的名字是：{playerName}，是否确认？"
}
```

### Text Formatting System

The chat system supports SQL-like text formatting commands with the following syntax:

```
ATTRIBUTES_1().ATTRIBUTES_2().ATTRIBUTES_3(...).TO('Targeted text');
```

#### Supported Attributes

- **STYLE('BOLD')** - Makes text bold
- **SIZE('LARGE')** - Makes text larger (1.5em)
- **SIZE('SMALL')** - Makes text smaller (0.8em)
- **FONT_COLOR('#FF0000')** - Changes text color (requires # prefix)

#### Examples

```json
{
    "eventCommand": "SHOW_MESSAGE",
    "characterName": "Narrator",
    "message": "This is {STYLE('BOLD').TO('bold text')} and {FONT_COLOR('#FF0000').TO('red text')}."
}
```

```json
{
    "eventCommand": "SHOW_MESSAGE",
    "characterName": "Character",
    "message": "{STYLE('BOLD').FONT_COLOR('#FF0000').SIZE('LARGE').TO('Important!')}"
}
```

### PAUSE Functionality

The system supports PAUSE commands for natural speech timing:

```json
{
    "eventCommand": "SHOW_MESSAGE",
    "characterName": "Character",
    "message": "Hello{PAUSE(100)}world!"
}
```

This will display "Hello", pause for 100ms, then continue with "world!".

### Template Variable Replacement

The system automatically replaces template variables with values from localStorage:

```json
{
    "eventCommand": "SHOW_MESSAGE",
    "characterName": "{playerName}",
    "message": "Welcome, {playerName}!"
}
```

If `playerName` is stored in localStorage as "张三", this will display:
- **Speaker**: 张三
- **Message**: Welcome, 张三!

### Message Box Configuration

- **Fixed Height**: 200px
- **Position**: Bottom center of screen
- **Width**: 80% of screen width (max 800px)
- **Background**: Semi-transparent overlay

## Notes

- Each test case directory should be self-contained with all its required resources
- Script files (.ts) should export their entry point functions
- Scene resource files (.json) should contain the scene-specific configuration
- The system will automatically load the correct test case based on the selection in the control panel
- Text formatting commands are processed in real-time with progressive display
- PAUSE commands create natural speech-like timing in dialogue
- Template variables are replaced dynamically from localStorage


