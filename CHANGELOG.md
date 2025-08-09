# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [0.1.0] - 2025-07-09

### Changed

- Completed full TypeScript migration
- Reorganized structure: managers, input, components, reusable UI system
