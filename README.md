# Norma

Norma is an intelligent personal logging application built with React Native and Expo. It leverages Google's Gemini AI to parse natural language inputs for both logging daily activities and searching through them.

## 🚀 Features

-   **Natural Language Logging**: Simply type what you did (e.g., "I drank coffee at 10 AM"), and the app uses Gemini AI to extract the event and timestamp automatically.
-   **Semantic Search**: An advanced search engine powered by LLM context. It understands synonyms and tense variations (e.g., searching "When did I run?" finds "I went for a jog" or "I ran yesterday") by filtering your entire log history intelligently.
-   **Dark Mode Support**: Fully customizable appearance with **Light**, **Dark**, and **Auto** modes. The Auto mode respects your device's system settings.
-   **Local Storage**: All event data is securely stored on your device using SQLite. Settings are persisted using AsyncStorage.
-   **Optimized Performance**: Uses `gemini-2.5-flash-lite` for fast and cost-effective AI operations.
-   **Unit Tested**: Critical services are covered by Jest unit tests.

## 🛠️ Tech Stack

-   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
-   **AI Model**: Google Gemini (`gemini-2.5-flash-lite`)
-   **Database**: SQLite (`expo-sqlite`) for logs, AsyncStorage for settings
-   **HTTP Client**: Axios
-   **Navigation**: React Navigation (Bottom Tabs)
-   **Testing**: Jest & Jest Expo

## 📱 Prerequisites

-   Node.js & npm
-   Expo Go app on your physical device OR an Android/iOS Emulator
-   A [Google Cloud API Key](https://aistudio.google.com/) with access to Gemini models.

## ⚙️ Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/shubham08gupta/Norma.git
    cd Norma
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    -   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    -   Open `.env` and replace `AIzaSy_DUMMY_KEY...` with your actual Gemini API Key.
    ```
    GEMINI_API_KEY=your_actual_api_key_here
    ```

## 🏃‍♂️ Running the App

Start the Expo development server:

```bash
npx expo start
```

-   **Android**: Press `a` (requires Android Studio emulator or connected device).
-   **iOS**: Press `i` (requires Xcode simulator or connected device).
-   **Physical Device**: Scan the QR code with the Expo Go app.

## 🧪 Testing

Run the unit test suite to verify the AI service integreation:

```bash
npm test
```
