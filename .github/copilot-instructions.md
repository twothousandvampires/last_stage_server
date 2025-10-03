# Copilot Instructions for last_stage_server

## Project Overview
- **TypeScript multiplayer game server** for a custom game, using Socket.IO for real-time communication and MySQL for persistent stats.
- Main entry: `src/index.ts` starts the server and initializes `GameServer`.
- Core logic is in `src/GameServer.ts`, which manages sockets, game state, player templates, and database integration.
- Game objects, abilities, items, and scenarios are organized in `src/Objects`, `src/Abilities`, `src/Items`, and `src/Scenarios`.

## Architecture & Data Flow
- **GameServer**: Central orchestrator. Handles socket events, player management, game lifecycle, and DB queries.
- **Level**: Represents a game session. Created per game start, manages players and game state.
- **Client**: Represents a connected player, tracks their template, items, and readiness.
- **Character**: Abstract base for all player-controlled units. Implements game logic, state transitions, and event triggers.
- **Builder**: Factory for creating game objects (characters, items, etc.).
- **Socket.IO**: Used for all client-server communication. Events are defined in `GameServer.ts` (e.g., `buy_item`, `select_skill`, `player_ready`).
- **MySQL**: Used for persistent stats (top scores, records). Connection and queries are in `GameServer.ts`.

## Developer Workflows
- **Build**: `npm run build` (cleans, compiles TypeScript, runs server from `dist/index.js`).
- **No tests**: The `test` script is a placeholder. No automated tests detected.
- **Debugging**: Add logging in server files. Socket events and DB errors are logged to console.
- **Hot reload**: Not configured. Restart server after code changes.

## Conventions & Patterns
- **Event-driven**: All game actions are triggered by Socket.IO events. See `GameServer.ts` for event names and payloads.
- **Game object composition**: Characters, items, abilities, and statuses are modular. Extend via inheritance and triggers.
- **State management**: Game state is tracked in `Level`, player state in `Client` and `Character`.
- **Item/Ability creation**: Use `Builder.createItem` and `Builder.createCharacter`.
- **Triggers**: Many game events use trigger arrays (e.g., `triggers_on_kill`, `triggers_on_block`) for extensibility.
- **Resource limits**: Items and upgrades are limited per player (see `Character.MAX_ITEMS_TO_PURCHASE`).

## Integration Points
- **Socket.IO**: All client actions and updates are via socket events. See `GameServer.ts` for full event list and handlers.
- **MySQL**: DB config is hardcoded in `GameServer.ts`. Used for stats and records only.
- **External dependencies**: See `package.json` for all required npm modules.

## Key Files & Directories
- `src/GameServer.ts`: Socket event definitions, game orchestration, DB integration.
- `src/Objects/src/Character.ts`: Player logic, state transitions, triggers.
- `src/Classes/Builder.ts`: Object factory.
- `src/Items/Item.ts`: Item base class and registry.
- `src/Abilities/Ability.ts`: Ability base class.
- `src/Scenarios/`: Game scenario definitions.

## Example Patterns
- **Adding a new item**: Implement in `src/Items/`, register in `Item.list`, use `Builder.createItem`.
- **Handling a new socket event**: Add handler in `GameServer.ts` under `this.socket.on('connection', ...)`.
- **Extending character logic**: Inherit from `Character`, override abstract methods, add triggers as needed.

---

For questions or unclear conventions, review `GameServer.ts` and `Character.ts` for authoritative patterns. Ask for feedback if any section is incomplete or unclear.