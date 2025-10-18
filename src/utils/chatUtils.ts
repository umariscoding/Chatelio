/**
 * Generates a chat title from the first message content
 * Takes the first 3 words and capitalizes appropriately
 */
export const generateChatTitle = (message: string): string => {
  if (!message || message.trim().length === 0) {
    return "New Conversation";
  }

  // Clean the message and split into words
  const cleanMessage = message.trim();
  const words = cleanMessage.split(/\s+/);

  // Take first 3 words
  const firstThreeWords = words.slice(0, 3);

  // If we have less than 3 words, use what we have
  if (firstThreeWords.length === 0) {
    return "New Conversation";
  }

  // Join the words and capitalize the first letter of the title
  const title = firstThreeWords.join(" ");

  // Capitalize first letter and ensure it's not too long
  const capitalizedTitle =
    title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

  // If title is too short (less than 3 characters), fallback
  if (capitalizedTitle.length < 3) {
    return "New Conversation";
  }

  return capitalizedTitle;
};

/**
 * Fallback titles for different user types
 */
export const FALLBACK_TITLES = {
  GUEST: "Guest Chat",
  USER: "New Conversation",
} as const;
