# 🩺 Medical Info Chatbot

![Chatbot Screenshot](./public/chatbot-screenshot.png)

An AI-powered chatbot built with Next.js and the ultra-fast Groq API, designed to provide quick and accurate medical information. This application features a clean, responsive interface with conversation history, making it a useful tool for informational purposes.

**Disclaimer:** This chatbot is for informational use only and does not constitute professional medical advice. Always consult a qualified healthcare provider for any medical concerns.

## ✨ Features

-   **Real-time Chat Interface:** A smooth and intuitive UI for conversing with the AI.
-   **Conversation Context:** The chatbot remembers previous messages in a session to provide relevant, contextual answers.
-   **Blazing Fast Responses:** Powered by the Groq API using the Llama 3.1 model for near-instantaneous replies.
-   **Helpful UI/UX:** Includes a "typing" indicator, welcome message, and clickable example prompts to guide users.
-   **Fully Responsive:** The design is optimized for a seamless experience on both desktop and mobile devices.

## 🛠️ Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (v14+)
-   **Language:** JavaScript, JSX
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **AI Model:** Llama 3.1 via [Groq API](https://groq.com/)
-   **Font:** [Geist](https://vercel.com/font)
-   **Deployment:** [AWS Amplify](https://aws.amazon.com/amplify/) / [Vercel](https://vercel.com/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [Git](https://git-scm.com/)

### 1. Clone the Repository

First, clone the repository to your local machine.

```bash
git clone https://github.com/sting-raider/AI_chatbot.git
cd AI_chatbot
```

### 2. Install Dependencies

Install the necessary npm packages.

```bash
npm install
```

### 3. Set Up Environment Variables

This project requires an API key from Groq to function.

1.  Create a new file in the root of your project named `.env.local`.
2.  Open the file and add the following line, replacing `your_groq_api_key` with your actual key from the [GroqCloud Console](https://console.groq.com/keys).

    ```
    GROQ_API_KEY="your_groq_api_key"
    ```

3.  The `.env.local` file is listed in `.gitignore` and should **never** be committed to your repository.

### 4. Run the Development Server

Start the Next.js development server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ☁️ Deployment

This application is optimized for deployment on serverless platforms like AWS Amplify or Vercel.

### Deploying with AWS Amplify

1.  Push your latest code to your GitHub repository.
2.  Log in to the **AWS Amplify Console**.
3.  Click **"New app" -> "Host web app"** and select your GitHub repository.
4.  Connect your `main` branch. Amplify will automatically detect the build settings.
5.  In the **Environment variables** section, add your `GROQ_API_KEY` and its value.
6.  Click **"Save and deploy"**. Amplify will build and deploy your application, providing a public URL when complete.

### Easiest Alternative: Vercel

As the creators of Next.js, Vercel provides a seamless deployment experience.

1.  Push your code to GitHub.
2.  Go to [Vercel](https://vercel.com/new) and import your GitHub repository.
3.  Vercel will auto-configure the project settings.
4.  Go to the **Settings -> Environment Variables** tab and add your `GROQ_API_KEY`.
5.  Deploy. Your site will be live in minutes.
