# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.0.0-beta.1] - 2026-06-18

### Added

- Crystal Shrine quest item markers on the world map
- Narrative texts for the start and end of the game
- Frost Skin is a new passive buff that increases maximum health by 50% while carring the Frost Relic
- Instant Fireball cast mechanic upon reaching 3 Combustion stacks
- Crystal quest item with decor properties
- Control panel component
- Quest log system: Main quest now triggered by a flashing icon instead of interrupting gameplay
- Quest marker over defeated bosses to turn in the final quest manually
- Post-game free roam to continue playing and completing side missions after the main story ends
- Options scene accessible from Main and Pause scenes
- Credits scene accessible from Main scene
- Custom cursor
- Smooth crossfading between different ambients
- Game title on the main menu screen
- Sign mark asset
- Game favicon for browser tabs

### Changed

- Refined world map terrain and landscape
- Increased damage taken by targets by 50% if they are immune to Frostbolt's freeze or slow
- Frost Relic now focuses on providing the Frost Skin buff rather than reducing enemy damage
- Replaced placeholders with authentic Frost and Fire relic icons
- Replaced five outdated icons with more suitable ones
- Several quest texts
- Moved main quest's text from forced full-screen pauses into the new clickable Quest Log
- Customized the game's dialog box
- Increased Blazeworm HP from 1000 to 1700
- Increased Sacryth HP from 2500 to 3200
- Increased Frostbolt's damage from 5 to 15
- Sacryth's Dread Aura now active during combat
- Shadow Vulnerability now increases cast time by 70% instead of increasing all incoming damage by 20%
- Dread Aura's damage now ignores all absorb shield effects
- Replaced aggro sounds for skeletons and zombies with a randomized sound pool
- Changed the temporary project name to the official title (Embercrest Rising)

### Fixed

- Various icon-related visual bugs
- Ambient audio bug when exiting to the main menu
- Hitbox of Blazeworm's Earth-shake spell

### Removed

- The Frostbite damage reduction effect
- All gameplay-interrupting text screens during quest transitions
- Automatic victory screen and forced quit after defeating the boss
- Default pointer and help cursors on interactive UI elements
- Letter post-glow effect


## [0.16.0] – 2026-05-16

### Added

- Bonfire system (respawn and healing)
- Cave ambient audio
- Frostbite debuff (applied by Frostbolt)
- Two new relics
- Electron and electron-builder for executable distribution
- Generate-build-name utility for version-based build directory naming
- Crystal Shrine quest
- Pause menu
- Credits on main screen

### Changed

- Map expanded from 17600px to 19200px
- Frostbolt reworked: now slows targets or reduces their damage by 30% if the they are slow-immune
- Canvas settings for improved display scaling
- Update global button styles, quest boards, and game flow screens

### Fixed

- Minor typos in code
- Tsconfig deprecation issues related to module resolution and paths
- Tooltip now appears correctly when pressing Shift while already hovering over an icon

### Removed

- Soul pedestal respawn mechanic
- Crystal shrine healing mechanic
- Options and credits buttons from main screen


## [0.15.1] – 2026-04-18

### Fixed

- Corrected version label displayed in main scene
- Lightning Shield absorb logic (overflow damage now applies correctly)  
- Spear hit behavior
- Inability to save Undying buff
- Resolved font and code typos


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
