#  Outfit Stylizer – Setup Guide

This guide helps you run the **Outfit Stylizer** web app locally and deploy it to Vercel.

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/outfit-stylizer.git
cd outfit-stylizer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add your OpenAI API key:

```env
OPENAI_API_KEY=your-openai-api-key-here
```

>  Do NOT commit your `.env` file. It should be included in `.gitignore`.

### 4. Start the development server

```bash
npm start
```

The app will run on [http://localhost:3000](http://localhost:3000)

---


That’s it! 
