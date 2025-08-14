# DISCLAIMER
This entire frontend is fully vibecoded. I didn't write a single line of code in this project. Don't take this project serious, i just wanted to see how well GitHub Copilot works for such a task.

# Wheelshare Frontend

This is the Vue 3 frontend for the Wheelshare app. It allows users to create a wheel, share a link, join a wheel, and spin in real time with others.

## Features
- Create a wheel with custom options
- Generate and share a unique link for each wheel
- Join a wheel by link
- Real-time spin synchronization using Socket.IO
- Modern, clean UI

## Getting Started

1. Install dependencies:
	```sh
	npm install
	```
2. Start the development server:
	```sh
	npm run dev
	```
3. The app will run on http://localhost:5173 by default.

## Configuration
- The backend server should be running (see backend/README.md).
- Update the backend URL in the frontend code if needed.

---
This frontend is intended for development/demo purposes. For production, configure environment variables and optimize the build as needed.
