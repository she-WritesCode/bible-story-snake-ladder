export type EpochType =
  | "SHEPHERD"
  | "COURT"
  | "WILDERNESS"
  | "THRONE"
  | "LEGACY";
export type SquareType =
  | "START"
  | "NORMAL"
  | "LADDER"
  | "SNAKE"
  | "GATE"
  | "FINISH";

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

export const EPOCHS: Record<
  EpochType,
  { name: string; color: string; bgClass: string }
> = {
  SHEPHERD: { name: "The Shepherd", color: "#8f9779", bgClass: "bg-[#d4d0a5]" },
  COURT: { name: "The Court", color: "#4682b4", bgClass: "bg-[#a3b1c6]" },
  WILDERNESS: {
    name: "The Wilderness",
    color: "#8b5a2b",
    bgClass: "bg-[#d9c5a0]",
  },
  THRONE: { name: "The Throne", color: "#8b0000", bgClass: "bg-[#c29b9b]" },
  LEGACY: { name: "The Legacy", color: "#d4af37", bgClass: "bg-[#e6d598]" },
};

export const getEpochForSquare = (id: number): EpochType => {
  if (id <= 20) return "SHEPHERD";
  if (id <= 40) return "COURT";
  if (id <= 60) return "WILDERNESS";
  if (id <= 80) return "THRONE";
  return "LEGACY";
};

export const GAME_BOARD: Square[] = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1;
  const epoch = getEpochForSquare(id);

  // Default values
  let type: SquareType = "NORMAL";
  let label = `Square ${id}`;
  let target: number | undefined;
  let trigger: string | undefined;
  let actionDescription: string | undefined;

  // 1. SET HISTORICAL MILESTONES (High Priority)
  if (id === 1) {
    type = "START";
    label = "Bethlehem Fields";
  } else if (id === 100) {
    type = "FINISH";
    label = "A Man After God's Heart";
  } else if (id % 20 === 0) {
    type = "GATE";
    label = `Gate of ${EPOCHS[epoch].name}`;
  } else if (id === 7) {
    type = "SNAKE";
    label = "Careless: Forgot a Sheep";
    target = 2;
    trigger = "Carelessness";
  } else if (id === 12) {
    type = "LADDER";
    label = "Killed Lion & Bear";
    target = 18;
  } else if (id === 25) {
    type = "SNAKE";
    label = "Saul's Jealousy Spear";
    target = 21;
  } else if (id === 32) {
    type = "LADDER";
    label = "Friendship with Jonathan";
    target = 38;
  } else if (id === 45) {
    type = "SNAKE";
    label = "Lying to the Priest at Nob";
    target = 41;
  } else if (id === 54) {
    type = "LADDER";
    label = "Spared Saul at En Gedi";
    target = 59;
  } else if (id === 66) {
    type = "SNAKE";
    label = "The Rooftop Temptation";
    target = 42;
  } else if (id === 72) {
    type = "LADDER";
    label = "Bringing the Ark Home";
    target = 78;
  } else if (id === 86) {
    type = "SNAKE";
    label = "Absalom's Rebellion";
    target = 61;
  } else if (id === 94) {
    type = "LADDER";
    label = "Solomon is Appointed";
    target = 98;
  }

  // 2. FILL THE GAPS (Density Rule: Max 3 spaces)
  // If the square is still "NORMAL" and meets the cadence, turn it into a Card Trigger.
  // We use % 4 so that if 1,2,3 are normal, 4 MUST be an interaction.
  else if (id % 4 === 0) {
    // Alternate between "LADDER" (Providence) and "SNAKE" (Temptation/Wisdom)
    // for the procedural squares.
    const isEvenFill = id % 8 === 0;
    type = isEvenFill ? "LADDER" : "SNAKE";
    label = isEvenFill ? "Divine Favor" : "Test of Wisdom";

    // Procedural movement for fill-in squares
    if (type === "LADDER") {
      target = Math.min(id + 3, 99);
    } else {
      target = Math.max(id - 3, 1);
    }

    trigger = isEvenFill ? "PROVIDENCE" : "WISDOM";
  }

  return { id, epoch, type, label, target, trigger, actionDescription };
});

export const CARDS: Card[] = [
  {
    id: "w1",
    type: "WISDOM",
    title: "The Shepherd",
    description: "How many stones did David pick up to fight Goliath?",
    question: "How many stones did David pick up to fight Goliath?",
    options: ["1", "3", "5", "7"],
    answer: "5",
  },
  {
    id: "w2",
    type: "WISDOM",
    title: "The Musician",
    description: "What instrument did David play to soothe King Saul?",
    question: "What instrument did David play to soothe King Saul?",
    options: ["Flute", "Harp/Lyre", "Trumpet", "Tambourine"],
    answer: "Harp/Lyre",
  },
  {
    id: "w3",
    type: "WISDOM",
    title: "The Friend",
    description: "Who was David's best friend, the son of King Saul?",
    question: "Who was David's best friend, the son of King Saul?",
    options: ["Abner", "Jonathan", "Joab", "Solomon"],
    answer: "Jonathan",
  },
  {
    id: "w4",
    type: "WISDOM",
    title: "The Fugitive",
    description: "Where did David hide from Saul when he was being hunted?",
    question: "Where did David hide from Saul when he was being hunted?",
    options: ["Jerusalem", "Caves of En Gedi", "Egypt", "Babylon"],
    answer: "Caves of En Gedi",
  },
  {
    id: "w5",
    type: "WISDOM",
    title: "The King",
    description: "Which city did David capture and make his capital?",
    question: "Which city did David capture and make his capital?",
    options: ["Hebron", "Bethlehem", "Jericho", "Jerusalem/Zion"],
    answer: "Jerusalem/Zion",
  },
  {
    id: "w6",
    type: "WISDOM",
    title: "The Poet",
    description:
      "Which book of the Bible contains most of the songs David wrote?",
    question: "Which book of the Bible contains most of the songs David wrote?",
    options: ["Proverbs", "Psalms", "Ecclesiastes", "Song of Solomon"],
    answer: "Psalms",
  },
  {
    id: "w7",
    type: "WISDOM",
    title: "The Scout",
    description:
      "David once snuck into Saul's camp while he was sleeping. What two items did he take to prove he was there?",
    question: "What two items did David take from Saul's sleeping camp?",
    options: [
      "A sword and shield",
      "A spear and a water jug",
      "A crown and a ring",
      "A cloak and sandals",
    ],
    answer: "A spear and a water jug",
  },
  {
    id: "w8",
    type: "WISDOM",
    title: "The Merciful",
    description: "Why did David refuse to kill Saul when he had the chance?",
    question: "Why did David refuse to kill Saul when he had the chance?",
    options: [
      "He was afraid of Saul's army",
      'Because Saul was "The Lord\'s Anointed"',
      "He forgot his sword",
      "Jonathan asked him not to",
    ],
    answer: 'Because Saul was "The Lord\'s Anointed"',
  },
  {
    id: "w9",
    type: "WISDOM",
    title: "The Warrior",
    description:
      "David fought many battles. Who was the commander of his army?",
    question: "Who was the commander of David's army?",
    options: ["Abner", "Joab", "Benaiah", "Uriah"],
    answer: "Joab",
  },
  {
    id: "w10",
    type: "WISDOM",
    title: "The Prophet",
    description:
      "God sent a prophet to confront David about his sin with Bathsheba.",
    question: "Which prophet confronted David about Bathsheba?",
    options: ["Samuel", "Elijah", "Nathan", "Isaiah"],
    answer: "Nathan",
  },
  {
    id: "w11",
    type: "WISDOM",
    title: "The King's Lineage",
    description: "Who was David's father?",
    question: "Who was David's father?",
    options: ["Jesse", "Saul", "Boaz", "Samuel"],
    answer: "Jesse",
  },
  {
    id: "w12",
    type: "WISDOM",
    title: "The Hometown",
    description: "In which town was David born and anointed?",
    question: "Where was David's hometown?",
    options: ["Jerusalem", "Nazareth", "Bethlehem", "Hebron"],
    answer: "Bethlehem",
  },
  {
    id: "w13",
    type: "WISDOM",
    title: "The Armor",
    description: "Whose armor did David try on before fighting Goliath?",
    question: "Whose armor did David find too heavy to wear?",
    options: ["Samuel's", "Jonathan's", "Saul's", "Eliab's"],
    answer: "Saul's",
  },
  {
    id: "w14",
    type: "WISDOM",
    title: "The Philistine Giant",
    description: "From which city did Goliath come?",
    question: "What was Goliath's hometown?",
    options: ["Gath", "Gaza", "Ashdod", "Ekron"],
    answer: "Gath",
  },
  {
    id: "w15",
    type: "WISDOM",
    title: "The Cave of Refuge",
    description:
      "What was the name of the cave where David’s family and the 400 men joined him?",
    question: "Which cave was David's headquarters in the wilderness?",
    options: ["En Gedi", "Adullam", "Macpelah", "Horeb"],
    answer: "Adullam",
  },
  {
    id: "w16",
    type: "WISDOM",
    title: "The First Wife",
    description: "Which daughter of Saul was David's first wife?",
    question: "Who was David's first wife?",
    options: ["Abigail", "Bathsheba", "Michal", "Maacah"],
    answer: "Michal",
  },
  {
    id: "p1",
    type: "PROVIDENCE",
    title: "Anointing Oil",
    description: "You are chosen for a great task! Move forward 5 spaces.",
    effect: { move: 5 },
  },
  {
    id: "p2",
    type: "PROVIDENCE",
    title: "Victory Dance",
    description: "You defeated the giant! Move forward 2 spaces.",
    effect: { move: 2 },
  },
  {
    id: "p3",
    type: "PROVIDENCE",
    title: "Ziklag Recovery",
    description: "You recovered what was lost! Move forward 3 spaces.",
    effect: { move: 3 },
  },
  {
    id: "p4",
    type: "PROVIDENCE",
    title: "Mighty Men",
    description:
      "You have found loyal friends to help you. Move forward 4 spaces.",
    effect: { move: 4 },
  },
  {
    id: "p5",
    type: "PROVIDENCE",
    title: "Psalm of Praise",
    description: "Your heart is full of worship. Move forward 3 spaces.",
    effect: { move: 3 },
  },
  {
    id: "p6",
    type: "PROVIDENCE",
    title: "Goliath's Sword",
    description:
      "The priest Ahimelech gives you Goliath's sword. You are armed for the journey! Move forward 3 spaces.",
    effect: { move: 3 },
  },
  {
    id: "p7",
    type: "PROVIDENCE",
    title: "Covenant with Jonathan",
    description:
      "Jonathan makes a covenant of friendship with you, protecting you from Saul. Move forward 4 spaces.",
    effect: { move: 4 },
  },
  {
    id: "p8",
    type: "PROVIDENCE",
    title: "Water from Bethlehem",
    description:
      "Your mighty men risk their lives to bring you water from Bethlehem. You are refreshed! Move forward 2 spaces.",
    effect: { move: 2 },
  },
  {
    id: "p9",
    type: "PROVIDENCE",
    title: "Abigail's Wisdom",
    description:
      "Abigail brings provisions and wise counsel, saving you from bloodshed. Move forward 3 spaces.",
    effect: { move: 3 },
  },
  {
    id: "p10",
    type: "PROVIDENCE",
    title: "The King's Crown",
    description:
      "You are crowned King over all Israel at Hebron. Move forward 5 spaces.",
    effect: { move: 5 },
  },
  {
    id: "p11",
    type: "PROVIDENCE",
    title: "Bread of the Presence",
    description:
      "The priest gives you holy bread when you are hungry. Gain strength! Move forward 3 spaces.",
    effect: { move: 3 },
  },
  {
    id: "p12",
    type: "PROVIDENCE",
    title: "Mephibosheth’s Kindness",
    description:
      "You showed kindness to Jonathan’s son. God honors your loyalty. Move forward 4 spaces.",
    effect: { move: 4 },
  },
  {
    id: "p13",
    type: "PROVIDENCE",
    title: "The Threshing Floor",
    description:
      "You built an altar to stop the plague. God hears your prayer! Move forward 5 spaces.",
    effect: { move: 5 },
  },
  {
    id: "p14",
    type: "PROVIDENCE",
    title: "The Brook Besor",
    description:
      "You let the weary soldiers rest and shared the spoil equally. Move forward 3 spaces.",
    effect: { move: 3 },
  },
  {
    id: "p15",
    type: "PROVIDENCE",
    title: "Hiram's Cedar",
    description:
      "King Hiram sends cedars to build your palace. Your kingdom is established! Move forward 4 spaces.",
    effect: { move: 4 },
  },
  {
    id: "t1",
    type: "TEMPTATION",
    title: "The Snake of Fear",
    description:
      "You fled to the Philistines because you stopped trusting God. Can you overcome your fear?",
    question: "What did David do when he was afraid of King Achish of Gath?",
    options: [
      "He fought him",
      "He pretended to be insane",
      "He ran to Egypt",
      "He surrendered",
    ],
    answer: "He pretended to be insane",
    successEffect: { move: 2 },
    failureEffect: { move: -4 },
  },
  {
    id: "t2",
    type: "TEMPTATION",
    title: "The Snake of Pride",
    description:
      "You counted your army to feel powerful instead of trusting God. Can you humble yourself?",
    question: "Who warned David not to count the fighting men of Israel?",
    options: ["Nathan", "Gad", "Joab", "Abishai"],
    answer: "Joab",
    successEffect: { move: 2 },
    failureEffect: { move: -5 },
  },
  {
    id: "t3",
    type: "TEMPTATION",
    title: "The Snake of Anger",
    description:
      "You almost attacked Nabal because he was rude to you. Can you show restraint?",
    question: "Who stopped David from taking revenge on Nabal?",
    options: ["Jonathan", "Abigail", "Michal", "Samuel"],
    answer: "Abigail",
    successEffect: { move: 3 },
    failureEffect: { move: -3 },
  },
  {
    id: "t4",
    type: "TEMPTATION",
    title: "The Snake of Idleness",
    description: "You stayed home from the war. Can you resist the temptation?",
    question: "What was David doing when he first saw Bathsheba?",
    options: [
      "Praying",
      "Walking on the roof of his palace",
      "Reading the law",
      "Sleeping",
    ],
    answer: "Walking on the roof of his palace",
    successEffect: { move: 1 },
    failureEffect: { move: -6 },
  },
  {
    id: "t5",
    type: "TEMPTATION",
    title: "The Snake of Deceit",
    description:
      "You lied to Ahimelech the priest, which led to the death of the priests of Nob. Can you face the truth?",
    question: "Who told King Saul that Ahimelech had helped David?",
    options: ["Doeg the Edomite", "Abner", "Joab", "Shimei"],
    answer: "Doeg the Edomite",
    successEffect: { move: 2 },
    failureEffect: { move: -4 },
  },
  {
    id: "t6",
    type: "TEMPTATION",
    title: "The Snake of Despair",
    description:
      "Your city of Ziklag was burned and your family taken captive. Your men want to stone you. Can you find strength in God?",
    question: "What did David do when his men turned against him at Ziklag?",
    options: [
      "He ran away",
      "He found strength in the Lord his God",
      "He fought his own men",
      "He surrendered to the Amalekites",
    ],
    answer: "He found strength in the Lord his God",
    successEffect: { move: 3 },
    failureEffect: { move: -5 },
  },
  {
    id: "t7",
    type: "TEMPTATION",
    title: "The Snake of Impatience",
    description:
      "You moved the Ark of the Covenant incorrectly, leading to Uzzah's death. Can you learn to follow God's instructions?",
    question: "How was the Ark supposed to be carried according to God's law?",
    options: [
      "On a new cart",
      "By horses",
      "Carried on poles by the Levites",
      "Rolled on logs",
    ],
    answer: "Carried on poles by the Levites",
    successEffect: { move: 2 },
    failureEffect: { move: -4 },
  },
  {
    id: "t8",
    type: "TEMPTATION",
    title: "The Snake of Vengeance",
    description:
      "Shimei cursed you and threw stones as you fled from Absalom. Can you show mercy?",
    question: "What did David say when Abishai wanted to kill Shimei?",
    options: [
      "'Kill him immediately'",
      "'Let him curse, for the Lord has told him to'",
      "'Put him in prison'",
      "'Cut off his hands'",
    ],
    answer: "'Let him curse, for the Lord has told him to'",
    successEffect: { move: 3 },
    failureEffect: { move: -3 },
  },
  {
    id: "t9",
    type: "TEMPTATION",
    title: "The Snake of Nabal",
    description:
      "Nabal insulted you! Will you take revenge or listen to Abigail?",
    question: "What does the name 'Nabal' mean?",
    options: ["Rich", "Fool", "Sheep", "Angry"],
    answer: "Fool",
    successEffect: { move: 3 },
    failureEffect: { move: -3 },
  },
  {
    id: "t10",
    type: "TEMPTATION",
    title: "The Snake of the Census",
    description: "You trusted in the number of your soldiers rather than God.",
    question: "Which of David's generals tried to talk him out of the census?",
    options: ["Joab", "Abishai", "Benaiah", "Ittai"],
    answer: "Joab",
    successEffect: { move: 1 },
    failureEffect: { move: -5 },
  },
  {
    id: "t11",
    type: "TEMPTATION",
    title: "The Snake of Keilah",
    description:
      "The people you saved are going to betray you to Saul! Can you ask God for direction?",
    question:
      "What object did the priest Abiathar bring to David to help him seek God?",
    options: ["The Ark", "The Ephod", "The Menorah", "The Censer"],
    answer: "The Ephod",
    successEffect: { move: 4 },
    failureEffect: { move: -2 },
  },
];
