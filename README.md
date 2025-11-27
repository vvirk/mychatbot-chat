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