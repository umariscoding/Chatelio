// Public chatbot page placeholder
interface PublicChatbotPageProps {
  params: {
    slug: string;
  };
}

export default function PublicChatbotPage({ params }: PublicChatbotPageProps) {
  return (
    <div>
      <h1>Public Chatbot for {params.slug}</h1>
      {/* Will be implemented in Day 6 */}
    </div>
  );
}
