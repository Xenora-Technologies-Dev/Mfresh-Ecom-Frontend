export type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
};

export const SUGGESTED_QUESTIONS = [
  "What is MFresh?",
  "How do I register?",
  "What categories are available?",
  "How does wholesale ordering work?",
  "How are suppliers verified?",
  "Which countries do you serve?",
] as const;

type KnowledgeEntry = {
  keywords: string[];
  answer: string;
};

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    keywords: ["what is", "about mfresh", "who are you", "tell me about", "mfresh"],
    answer:
      "MFresh is a global B2B food marketplace connecting buyers with verified wholesale suppliers across 150+ countries. We cover seafood, meats, produce, dairy, pantry goods, and more — all with transparent pricing and secure escrow.",
  },
  {
    keywords: ["register", "sign up", "join", "create account", "become"],
    answer:
      "You can register as a Buyer or Seller from the header. Buyers browse and place bulk orders; Sellers list products and manage wholesale catalogues. Head to Register as Buyer or Register as Seller to get started!",
  },
  {
    keywords: ["buyer", "purchase", "order", "buy"],
    answer:
      "As a buyer, browse categories or search products, check MOQ (minimum order quantity) and supplier ratings, then place bulk orders. Payments go through secure escrow until delivery is confirmed.",
  },
  {
    keywords: ["seller", "sell", "list product", "supplier portal"],
    answer:
      "Sellers can register via 'Register as Seller', complete verification, and list wholesale products with pricing, MOQ, and origin details. Our seller portal helps manage orders, inventory, and buyer inquiries.",
  },
  {
    keywords: ["categor", "product type", "what do you sell", "food type", "seafood", "meat", "produce"],
    answer:
      "MFresh covers three core pillars: Aquatic Animals (seafood), Land Animals (meats & poultry), and Plants (produce, grains & spices). Browse all categories from the Categories page!",
  },
  {
    keywords: ["wholesale", "bulk", "moq", "minimum order"],
    answer:
      "All products on MFresh are wholesale with MOQ listed on each product card (e.g. 50 kg, 100 units). Prices are in USD with AED/SGD conversion available. Contact suppliers directly for custom bulk deals.",
  },
  {
    keywords: ["verif", "trust", "quality", "inspect"],
    answer:
      "Every supplier on MFresh is vetted for quality, compliance, and reliability. Verified badges appear on supplier profiles. We also offer quality inspection services for high-value orders.",
  },
  {
    keywords: ["countr", "region", "uae", "dubai", "singapore", "global", "deliver", "ship", "logistic"],
    answer:
      "MFresh serves buyers and suppliers across the UAE, Singapore, Middle East, Asia-Pacific, and 150+ countries worldwide. Streamlined international logistics with order tracking from confirmation to shipment.",
  },
  {
    keywords: ["pay", "payment", "escrow", "price", "cost", "currency", "usd", "aed"],
    answer:
      "Pricing is transparent in USD with local currency conversion (AED, SGD). Payments are held in secure escrow until order delivery is confirmed — protecting both buyers and sellers.",
  },
  {
    keywords: ["contact", "support", "help", "email", "phone", "reach"],
    answer:
      "Reach us at hello@mfresh.com or +971 4 000 0000. You can also visit our Contact page for inquiries, partnership requests, or support tickets.",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    answer:
      "Hey there! 🍎 I'm MFreshy, your friendly food marketplace guide. Ask me about registering, categories, wholesale orders, suppliers, or anything MFresh!",
  },
  {
    keywords: ["thank", "thanks", "bye", "goodbye"],
    answer:
      "You're welcome! Happy sourcing on MFresh. Come back anytime if you need help finding suppliers or placing bulk orders! 🌿",
  },
];

const FALLBACK_RESPONSES = [
  "Hmm, I'm not sure about that one! Try asking about registration, categories, wholesale orders, or supplier verification.",
  "Good question! I can help with MFresh registration, product categories, MOQ, payments, and supplier info. What would you like to know?",
  "I'm best at MFresh marketplace questions — try 'How do I register?' or 'What categories are available?'",
];

export function getBotResponse(input: string): string {
  const normalized = input.toLowerCase().trim();
  if (!normalized) return "Type a question and I'll do my best to help!";

  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword)) score += keyword.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) return bestMatch.answer;

  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

export const WELCOME_MESSAGE =
  "Hi! I'm MFreshy 🍎 — your MFresh marketplace buddy! Ask me anything about registering, wholesale orders, categories, or finding verified suppliers.";
