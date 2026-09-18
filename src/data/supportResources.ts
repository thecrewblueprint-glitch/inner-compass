export type SupportResource = {
  name: string;
  contact: string;
  url: string;
  description: string;
};

export const supportResources: SupportResource[] = [
  {
    name: "988 Lifeline",
    contact: "Call or text 988",
    url: "https://988lifeline.org",
    description: "24/7 crisis and emotional support in the United States."
  },
  {
    name: "211",
    contact: "Call 211",
    url: "https://www.211.org",
    description: "Local help with housing, food, health, transportation, and other essential services."
  },
  {
    name: "National Domestic Violence Hotline",
    contact: "1-800-799-7233",
    url: "https://www.thehotline.org",
    description: "Confidential relationship-safety support and planning."
  },
  {
    name: "RAINN",
    contact: "1-800-656-4673",
    url: "https://www.rainn.org",
    description: "Confidential support for sexual violence."
  }
];
