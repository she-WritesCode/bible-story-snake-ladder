import { Story } from "../../gameData";
import { DAVID_EPOCHS, DAVID_SQUARES, DAVID_CARDS } from "./davidStory";
import { ESTHER_EPOCHS, ESTHER_SQUARES, ESTHER_CARDS } from "./estherStory";

export const DAVID_STORY: Story = {
  id: "DAVID_01",
  name: "David's Journey",
  characterId: "DAVID",
  epochs: DAVID_EPOCHS,
  fixedSquares: DAVID_SQUARES,
  cards: DAVID_CARDS,
};

export const ESTHER_STORY: Story = {
  id: "ESTHER_01",
  name: "Esther's Journey",
  characterId: "ESTHER",
  epochs: ESTHER_EPOCHS,
  fixedSquares: ESTHER_SQUARES,
  cards: ESTHER_CARDS,
};

export const STORIES: Record<string, Story> = {
  DAVID: DAVID_STORY,
  ESTHER: ESTHER_STORY,
};
