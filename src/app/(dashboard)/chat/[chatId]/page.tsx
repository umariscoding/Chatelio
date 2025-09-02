// Individual chat page placeholder
interface ChatDetailPageProps {
  params: {
    chatId: string;
  };
}

export default function ChatDetailPage({ params }: ChatDetailPageProps) {
  return (
    <div>
      <h1>Chat {params.chatId}</h1>
      {/* Will be implemented in Day 5 */}
    </div>
  );
}
