export const generateChatTitle = (message: string): string => {
  if (!message || message.trim().length === 0) {
    return "New Conversation";
  }

  const cleanMessage = message.trim();
  const words = cleanMessage.split(/\s+/);

  const firstThreeWords = words.slice(0, 3);

  if (firstThreeWords.length === 0) {
    return "New Conversation";
  }

  const title = firstThreeWords.join(" ");

  const capitalizedTitle =
    title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

  if (capitalizedTitle.length < 3) {
    return "New Conversation";
  }

  return capitalizedTitle;
};

export const FALLBACK_TITLES = {
  GUEST: "Guest Chat",
  USER: "New Conversation",
} as const;
