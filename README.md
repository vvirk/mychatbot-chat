# MyChatBot Agent Chat

Small React + TypeScript application that simulates a support agent chat integrated with a fake WebSocket-like connection (`FakeSocket`).  
The focus is on **connection state management**, **optimistic UI for outgoing messages**, and **queueing / retrying messages when the connection changes**.

---

## Tech stack

- **React 18 + TypeScript**
- **Vite** – fast dev/build tooling
- **Redux Toolkit** – state management (chat slice + middleware)
- **React-Redux** – bindings
- **Tailwind CSS** – styling and layout

---

## How to run

### Prerequisites

- Node.js **v20+**
- npm / yarn

### Install and start

```bash
npm install
npm run dev
```

## Time spent

Approximately 3-4 hours in total, including:

- setting up project structure and architecture
- implementing chat state (Redux slice + selectors)
- implementing middleware with optimistic updates and queue handling
- designing and coding the FakeSocket (ack/error/incoming + random disconnect/reconnect)
- building the UI (layout, message bubbles, status colors, panels, input)
- writing unit tests for reducers and middleware (Vitest)
- refactoring ChatPage into smaller components
- documentation and polishing

## If I had more time

If additional time were available, I would improve or extend the project in the following ways:

- Implement **manual retry** for failed messages directly in the UI.
- Persist outgoing queue and chat state across page refresh using local storage or IndexedDB.
- Add **auto-scroll to bottom** on new messages and smoother UI transitions.
- Add typing indicators and presence indicators (simulated or real).
- Create more detailed design, themes for light/dark mode.
- Add integration with a real WebSocket backend to replace FakeSocket.
- **Add a fully configured ESLint + Prettier setup** to ensure consistent formatting, enforce code style rules, and reduce the chance of subtle bugs or stylistic drift across the codebase.
- **Further improve code cleanliness and structure** – splitting components even more granularly where appropriate, extracting shared UI primitives, and reducing inline logic to achieve a more polished, production-ready architecture.

