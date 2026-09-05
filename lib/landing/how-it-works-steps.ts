export const HOW_IT_WORKS_STEPS = [
  {
    id: "post",
    number: "01",
    title: "Post a Task",
    description: "Describe what you need. Neighbors nearby can see it.",
  },
  {
    id: "offers",
    number: "02",
    title: "Get Offers Nearby",
    description: "People close to you send offers with a cash price.",
  },
  {
    id: "choose",
    number: "03",
    title: "Choose a Helper",
    description: "Pick the person who fits the job and the price.",
  },
  {
    id: "done",
    number: "04",
    title: "Get it Done",
    description: "Meet nearby, finish the task, and pay in cash.",
  },
  {
    id: "review",
    number: "05",
    title: "Review & Rate",
    description: "Leave a rating so the next neighbor knows who to trust.",
  },
] as const;

export type HowItWorksStepId = (typeof HOW_IT_WORKS_STEPS)[number]["id"];
