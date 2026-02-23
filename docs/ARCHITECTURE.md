# Architecture: Strategy-Based RPG Board

This document describes the evolved architecture of the Bible Story Snake & Ladder game, transitioning from a linear experience to a multi-character, strategy-based engine.

## Core Concepts

### 1. Character-Based RPG Mechanics

Each player session begins with character selection. Characters are not just visual avatars; they are "classes" with:

- **Starting Stat Profiles**: Initial values for Faith, Wisdom, Courage, etc.
- **Passive Abilities**: Hooks that modify game engine behavior (e.g., doubling moves, bypassing penalties).
- **Epoch Titles**: Story-specific nomenclature for the character's journey stages.

### 2. Story-Provider Pattern

The game engine is decoupled from the content. A `StoryLoader` injects:

- **Board Configuration**: 100 squares with story-specific landmarks (Ladders/Snakes).
- **Card Deck**: A set of 30+ cards categorized by type (Wisdom, Providence, Temptation, Wildcard).
- **Themes & Assets**: Visual styling and audio cues specific to the story.

## Data Schema

### Character

```typescript
export interface Character {
  id: string;
  name: string;
  epochTitles: Record<string, string>;
  abilities: {
    name: string;
    description: string;
    effect: (move: number, type: string) => number;
  };
  startingStats: {
    faith: number;
    wisdom: number;
    courage: number;
    [key: string]: number;
  };
}
```

### Story

```typescript
export interface Story {
  id: string;
  characterId: string;
  name: string;
  epochs: EpochConfig[];
  squares: SquareConfig[];
  cards: Card[];
  specialMechanisms?: Record<string, any>;
}
```

## JSON-Driven Injection

All story data is stored in JSON format (or TypeScript objects acting as JSON) to allow for easy expansion. New stories can be added by simply providing a new story configuration without modifying the core `GameEngine`.

## Multi-Story Roadmap

1. **David**: The Warrior (Existing - Refactoring to new schema).
2. **Esther**: The Advocate (New - Strategy & Favor focus).
3. **Daniel**: The Visionary (New - Persistence & Purity focus).
4. **Joseph**: The Administrator (Planned - Provisioning focus).
