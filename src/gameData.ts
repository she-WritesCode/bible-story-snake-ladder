export type EpochType = string;
export type SquareType = "START" | "NORMAL" | "LADDER" | "SNAKE" | "GATE" | "FINISH";

export interface Square {
  id: number;
  epoch: EpochType;
  type: SquareType;
  label?: string;
  target?: number;
  trigger?: string;
  penalty?: { move: number; stat: string; value: number };
  actionDescription?: string;
  requirement?: string;
  onFail?: { targetSquare: number };
}

export interface Card {
  id: string;
  type: "WISDOM" | "PROVIDENCE" | "TEMPTATION" | "WILDCARD";
  title: string;
  description: string;
  question?: string;
  answer?: string;
  options?: string[];
  effect?: {
    move?: number;
    targetSquare?: number;
    skipTurn?: boolean;
    stat?: string;
    value?: number;
  };
  successEffect?: {
    move?: number;
  };
  failureEffect?: {
    move?: number;
  };
}

export interface EpochConfig {
  id: string;
  name: string;
  color: string;
  bgClass: string;
}

export interface Story {
  id: string;
  name: string;
  characterId: string;
  epochs: EpochConfig[];
  fixedSquares: Partial<Square>[];
  cards: Card[];
}

export const generateBoard = (story: Story): Square[] => {
  const { epochs, fixedSquares } = story;

  return Array.from({ length: 100 }, (_, i) => {
    const id = i + 1;
    const epochIndex = Math.floor((id - 1) / 20);
    const epoch = epochs[epochIndex]?.id || epochs[epochs.length - 1].id;

    // Check if there's a fixed square for this ID
    const fixed = fixedSquares.find((s) => s.id === id);
    if (fixed) {
      return {
        id,
        epoch,
        type: fixed.type || "NORMAL",
        label: fixed.label || `Square ${id}`,
        ...fixed,
      } as Square;
    }

    // Default procedural generation for "gaps"
    let type: SquareType = "NORMAL";
    let label = `Square ${id}`;
    let target: number | undefined;
    let trigger: string | undefined;

    if (id % 4 === 0) {
      const isEvenFill = id % 8 === 0;
      type = isEvenFill ? "LADDER" : "SNAKE";
      label = isEvenFill ? "Divine Favor" : "Test of Wisdom";
      target = isEvenFill ? Math.min(id + 3, 99) : Math.max(id - 3, 1);
      trigger = isEvenFill ? "PROVIDENCE" : "WISDOM";
    }

    return { id, epoch, type, label, target, trigger };
  });
};

// Legacy support for initially loaded board (David)
// This will be replaced by dynamic loading in App.tsx
export const getActiveStoryData = (story: Story) => {
  const board = generateBoard(story);
  const epochsMap: Record<string, EpochConfig> = {};
  story.epochs.forEach((e) => {
    epochsMap[e.id] = e;
  });
  return { board, cards: story.cards, epochs: epochsMap };
};
