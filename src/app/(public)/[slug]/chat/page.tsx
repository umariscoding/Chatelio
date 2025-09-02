// Public chat interface placeholder
interface PublicChatPageProps {
  params: {
    slug: string;
  };
}

export default function PublicChatPage({ params }: PublicChatPageProps) {
  return (
    <div>
      <h1>Chat with {params.slug}</h1>
      {/* Will be implemented in Day 6 */}
    </div>
  );
}
