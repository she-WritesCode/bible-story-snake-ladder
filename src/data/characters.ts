export type EpochType = string;
export type SquareType = "START" | "NORMAL" | "LADDER" | "SNAKE" | "GATE" | "FINISH";

export interface Character {
  id: string;
  name: string;
  epochTitles: Record<string, string>; // e.g. "SHEPHERD": "The Shepherd"
  abilities: {
    name: string;
    description: string;
    // Modified signature to allow for more flexible effects
    effect: (move: number, type: SquareType, context?: any) => number;
  };
  startingStats: {
    faith: number;
    wisdom: number;
    courage: number;
    favored?: number; // Unique stat for Esther
    spirituality?: number; // Unique stat for Daniel
  };
}

export const CHARACTERS: Record<string, Character> = {
  DAVID: {
    id: "DAVID",
    name: "David (The Warrior)",
    epochTitles: {
      "1": "The Shepherd",
      "2": "The Courtier",
      "3": "The Fugitive",
      "4": "The King",
      "5": "The Legacy",
    },
    abilities: {
      name: "Giant Slayer",
      description: "If he lands on a Snake, he gets two chances to answer the Wisdom question.",
      effect: (move, type) => move, // Logic to be implemented in engine
    },
    startingStats: {
      faith: 10,
      wisdom: 10,
      courage: 15,
    },
  },
  ESTHER: {
    id: "ESTHER",
    name: "Esther (The Advocate)",
    epochTitles: {
      "1": "The Pageant",
      "2": "The Secret",
      "3": "The Decree",
      "4": "The Banquet",
      "5": "The Deliverance",
    },
    abilities: {
      name: "Royal Favor",
      description: "She can skip any 'Snake' penalty once per Epoch by using her 'Scepter' ability.",
      effect: (move, type) => move, // Logic to be implemented in engine
    },
    startingStats: {
      faith: 15,
      wisdom: 15,
      courage: 10,
      favored: 10,
    },
  },
  DANIEL: {
    id: "DANIEL",
    name: "Daniel (The Visionary)",
    epochTitles: {
      "1": "The Training",
      "2": "The Dream",
      "3": "The Golden Statue",
      "4": "The Lion’s Den",
      "5": "The Prophecy",
    },
    abilities: {
      name: "Interpreter of Dreams",
      description: "He can see the next 3 cards in the deck, allowing him to plan his moves.",
      effect: (move, type) => move, // Logic to be implemented in engine
    },
    startingStats: {
      faith: 20,
      wisdom: 15,
      courage: 10,
      spirituality: 10,
    },
  },
  JOSEPH: {
    id: "JOSEPH",
    name: "Joseph (The Administrator)",
    epochTitles: {
      "1": "The Pit",
      "2": "The Potiphar's House",
      "3": "The Prison",
      "4": "The Palace",
      "5": "The Provider",
    },
    abilities: {
      name: "Provisioner",
      description: "He earns double moves from 'Providence' cards because he prepares for the future.",
      effect: (move, type) => (type === "LADDER" ? move * 2 : move),
    },
    startingStats: {
      faith: 15,
      wisdom: 20,
      courage: 10,
    },
  },
};
