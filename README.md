# 🌿 MindFlow
**A mobile app supporting the mental health of urban residents**

---

## 🧠 Project Overview
**MindFlow** is a mobile application designed to reduce stress and overstimulation among young adults by combining **artificial intelligence**, **relaxation maps**, and **personalized recommendations**.  
Our goal is to create healthier, more balanced cities — where technology supports people instead of overwhelming them.

---

## 🤖 MindBot – Your Personal Well-Being Assistant
At the heart of the app is **MindBot (Agentic AI)** – an intelligent companion that:
- Analyzes your **mood** and daily context,  
- **Initiates actions on its own**, suggesting activities such as a walk, meditation, stretching, or a short offline break,  
- Helps you build **healthy habits** and maintain **emotional balance**.  

Using AI-driven recommendations, the app learns your preferences and develops a plan for improving your well-being.

---

## 🌿 Key Features
- 🧘 **MindBot (AI Chat)** – interact with the AI and receive personalized activity suggestions.  
- 🗺️ **Relaxation Map** – discover calm, nature-friendly spots in your city.  
- 📈 **Chill Index** – a well-being indicator based on your lifestyle and activities.  
- 🔔 **Reminders System** – supports consistency and emotional awareness.  
- 🪞 **Statistics & Progress** – track your improvement over time.  

---

## ⚙️ Tech Stack
- **Frontend (Mobile)**: React Native + Expo  
- **Backend / AI**: DeepSeek API (Agentic AI)  
- **Database**: Firebase Firestore  
- **Notifications**: Expo Notifications  
- **Authentication**: Firebase Auth  
- **Local Storage**: AsyncStorage  

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/mindflow.git
cd mindflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables
Create a `.env` file in the root directory and add your API key:
```bash
EXPO_PUBLIC_DEEPSEEK_API_KEY=<your_api_key_here>
```

> 🔒 In production, use **EAS Secrets** for secure environment variable management.

### 4. Run in development mode
```bash
npx expo start
```

### 5. Build APK (for Android)
```bash
eas build -p android --profile preview
```

---

## 📱 Screens (example)
| MindBot | Reminders | Chill Index |
|----------|------------|-------------|
| 🤖 AI Chat | 🔔 Reminder list | 📊 Progress tracking |

---

## 💚 Project Mission
MindFlow was created as a response to the growing **problem of overstimulation and stress** among young urban residents.  
Our vision is to build cities where **technology supports mental health**, promoting moments of calm, nature, and self-care.

---

## 👥 Team
MindFlow was developed by an interdisciplinary team combining expertise in:
- Software Engineering  
- Psychology & UX Design  
- Data Analysis & Artificial Intelligence  

---

## 📄 License
This project is released under the **MIT License** — feel free to use, modify, and build upon it.
