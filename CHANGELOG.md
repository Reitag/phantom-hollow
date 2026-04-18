# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.15.0] – 2026-04-18

### Added

- Main Menu Scene
- Save progress system
- Audio system and sound effects
- Game flow system (Intro Scene, Game Start Scene, Victory Scene, Outro Scene)
- Greeting letter for main character

### Changed

- Updated quest text
- Rebalanced boss HP and spell power
- Reworked Lightning Potion mechanics
- Changed crystal shrine art
- Updated background visuals
- Restructured assets for Vite build

### Fixed

- Save system issues
- Quest event bugs
- Background size issue
- Tilemap export assets
- Various typos


## [0.14.0] – 2026-03-08

### Added

- Blazeworm's Fang quest
- Haste Potion and Haste buff effect
- Visual effect for Dread Aura
- Styled quest frame and quest text UI
- Boss Health Bar
- Crystal Shrine healing area that restores health

### Changed

- Reworked Undying Potion mechanic
- Updated store sprite
- Improved quest mark indicator
- Updated Protection buff icon
- Rebalanced boss HP and spell power


## [0.13.0] – 2026-02-08

### Added

- Alchemist NPC with environment setup and spawn system
- Alchemist quest trigger zone
- New item icons and a utility key for panel bar usage
- Loot zones for item drops
- Wind Pulse spell along with spritesheet and icon
- Stone of Concentration item
- Blazeworm Fang quest item

### Changed

- Updated inventory slot visuals and bound UI coordinates to Tiled
- Refactored UI panel bars interaction: added icon-based clicking and dragging modes
- Reworked movement, spell and inventory key bindings
- Updated store UI
- Improved modifier icon container
- Updated README file

### Fixed

- Fixed split-sprite rendering bug
- Fixed minor UI and gameplay bugs

### Removed

- Wind spell


## [0.12.0] – 2025-12-20

### Added

- Jump, fall and duck player states
- Boss trigger zones
- Tooltips for spells, items, modifiers, and the store
- On-screen damage dealt display

### Changed

- Refactored level logic: moved spawn points from code to Tiled
- Expanded boss mechanics with new spells and behavior updates
- Updated player sprite

### Removed

- Ready player state (no longer used)


## [0.11.0] – 2025-11-22

### Added

- Inventory management system, item swapping/moving/deleting
- Potions: heal, protection, undying, SP potion
- Coin items and PickUp/Loot systems
- Store system and ability to buy items
- Loot drops from enemies
- Stats class for characters
- Slot highlight, UI text component
- Enemy spawn system and enemy positions
- New side boss Blazeworm and spell power system
- Archer enemy and Arrow weapon
- Decor and rock layers
- Lightning Shield spell and lightning potion
- Frostbolt spell and freeze state
- SoulStone, SoulFire, and full player respawn system
- Interactable systems such as Stall and SoulPedestal
- VFX class for buffs and debuffs
- Arcane Mind buff (freeze-resist effect)

### Changed

- Reworked level one, added diversity and adjusted jump height
- Reworked collision system
- Updated enemy-wall collision and dynamic startPointX logic
- Unified animation folder structure and state constants
- Reworked character casting animation
- Changed spell animation key resolution and spell sizes
- Improved debug screen (Memory Monitor)
- Improved aggro logic
- Restructured and renamed folders

### Fixed

- Frame-rate independence using delta time
- Enemy respawn issues and added respawn vfx
- Memory leak in UI Scene
- Various spell/collision-related issues
- Buff/debuff icon issues

### Removed

- Removed Wait state


## [0.10.0] - 2025-09-21

### Added

- Wind spell with unique movement-based mechanics.
- Movement component system for characters.
- First boss, Evil Wizzard, with abilities and mechanics.
- `DamageMultiplier` component for flexible damage scaling.

### Changed

- Rebalanced character speed for smoother gameplay.
- Redesigned Level 1 layout for improved flow and pacing.
- Improved constant notation for cleaner, more maintainable code.
- Restructured project directories for better organization.

### Fixed

- Logic issues with the Wind spell.
- Boss mechanic bugs affecting abilities and behavior.
- Issues with movement and modifier components.

### Removed

- Obsolete animation check from the base `CharacterState` class.


## [0.9.0] - 2025-08-23

### Added

- Debugger for development.
- Asset-keys generator and constants for cleaner asset management.
- Zombie enemy with a new disease ability.
- Debuff system for status effects.
- Spears as a new weapon type.
- Expanded map size to 11200px.

### Changed

- Re-created the entire UI kit for better usability.
- Updated castbar behavior for more accurate spell timing.

### Fixed

- Background grass rendering issues.


## [0.8.0] - 2025-08-09

### Added

- Sandbox interface, a central gameplay API that lets spells and other game systems safely interact with the player, cooldowns, and UI without hard coupling.
- Service locator, a global service registry to make accessing managers (UI, cooldowns, spell factory, etc.) easier and more modular.


## [0.7.0] - 2025-08-04

### Added

- Spell system refactor: Introduced an abstract `Spell` base class with centralized lifecycle management.
- Valid teleport position system to prevent teleporting inside solid tiles, with fallback search for safe spots.
- New player state machine architecture, enabling clearer state transitions (Idle, Movement, Casting, etc.).
- Skeleton Warrior AI implementation with chase and vision detection.
- Reusable state machine utility applied to both player and AI enemies.

### Changed

- Improved animation configuration for spells — main and destroy animations now explicitly configured per spell type.
- Improved velocity setup to prevent race conditions by deferring until the physics world step.
- Reorganized project folder structure for clearer separation of core objects, states, and utilities.

### Fixed

- Fixed multiple bugs with skeleton vision range and AI detection logic.
- Fixed spell velocity not applying correctly on spawn due to physics initialization timing.
- Fixed incorrect teleport destination when near collidable tiles.

### Removed

- Old JavaScript files containing outdated and unreliable code, replaced with cleaner TypeScript implementations.


## [0.6.0] - 2025-08-02

### Changed

- Improved player and enemy state logic.
- Fixed various code issues to increase stability.

## [0.5.2] - 2025-07-27

### Added

- Player-specific states (Idle, Movement, etc.).

### Changed

- Reworked folder structures for better project organization.


## [0.5.0] - 2025-07-21

### Added

- Core state machine implementation.
- Skeleton enemy now uses the new state machine for cleaner AI logic.


## [0.4.0] - 2025-07-19

### Added

- Skeleton Warrior enemy with basic AI tools and combat behavior.


## [0.2.0] - 2025-07-17

### Added

- ESLint 9.x and Prettier integration for consistent code style.
- Initial changelog documentation.


## [0.1.0] - 2025-07-09

### Changed

- Completed full TypeScript migration
- Reorganized structure: managers, input, components, reusable UI system


## [Pre-Release] - Prototype Phase (JavaScript, pre-0.1.0)

### Added

- Initial game prototype with core mechanics.
- UI components and cooldown effects.
- GraphicsMask and tilemap components.
- Skeleton Warrior prototype and basic AI (pre-TypeScript refactor).

### Changed

- Background rendering improvements (middle layer rework).
- Added first complete level layout.

### Fixed

- Code issues related to background rendering and UI integration.
