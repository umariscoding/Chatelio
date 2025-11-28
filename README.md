# Chatelio User - Public Chat Interface

Standalone React application for the Chatelio public chatbot interface. Extracted from the monolithic Next.js application with controller+component+thunk Redux architecture.

## Tech Stack

- React 18.2.0
- Vite 5.0
- TypeScript
- React Router 6
- Redux Toolkit
- Redux Persist
- Axios
- Tailwind CSS
- Lucide React Icons

## Project Structure

```
src/
├── app/                 # App entry and routing
├── pages/ChatPage/      # Chat page (controller + view)
├── components/
│   ├── chat/           # Chat components
│   ├── auth/           # Auth components
│   └── ui/             # UI primitives
├── store/
│   ├── slices/         # Redux slices (userAuth, chat)
│   └── thunks/         # Async thunks (auth, chat)
├── hooks/              # Custom React hooks
├── utils/              # Utilities (API, subdomain parser)
├── types/              # TypeScript types
└── styles/             # Global styles
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:8000
```

## Subdomain Routing

The app extracts the company slug from the subdomain:

- `chatbot1.localhost:3000` → slug: "chatbot1"
- `chatbot1.chatelio.com` → slug: "chatbot1"

For local development, add to your hosts file:

```
127.0.0.1 chatbot1.localhost
127.0.0.1 chatbot2.localhost
```

## Features

- Guest chat mode (automatic guest token creation)
- User authentication (login/register)
- Chat history (for authenticated users)
- Real-time message streaming
- Token refresh mechanism
- Redux persist for auth state

## Architecture Pattern

**Controller + Component + Thunk**:

- **Controllers**: Business logic, state management
- **Components (Views)**: Pure presentation
- **Thunks**: Async operations (API calls)

Example: `ChatPage.tsx` (controller) + `ChatPageView.tsx` (component)

## API Integration

Uses identical endpoints as the admin app:

- `POST /users/guest/create`
- `POST /users/login`
- `POST /users/register`
- `GET /chat/list`
- `POST /chat/send`
- `GET /chat/history/{chatId}`
