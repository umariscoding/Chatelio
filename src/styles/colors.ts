// Improved interface colors - better blue with complementary greys
export const CHAT_COLORS = {
  // User message colors
  userBg: '#007bff', // improved primary-500 (better blue)
  userText: '#ffffff',
  userBorder: '#0066cc', // primary-600
  
  // Bot message colors
  botBg: '#f8f9fa', // improved neutral-100 (recommended light background)
  botText: '#000000', // pure black for better contrast
  botBorder: '#dee2e6', // improved border-light
  
  // Chat interface
  background: '#ffffff',
  sidebarBg: '#f8f9fa', // improved neutral-100 
  sidebarBorder: '#dee2e6', // improved border-light
  
  // Interactive elements
  hoverBg: '#e9ecef', // improved neutral-200
  activeBg: '#e6f3ff', // improved primary-50
  selectedBg: '#cce7ff', // improved primary-100
  
  // Input area
  inputBg: '#ffffff',
  inputBorder: '#ced4da', // improved border-medium
  inputFocus: '#007bff', // improved primary-500 (better blue)
} as const;
