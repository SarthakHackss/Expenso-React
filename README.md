# EXPENSO - Modern Smart Expense Tracker (Web & Android APK)

EXPENSO is a modern, high-performance expense tracker built with **React**, **Vite**, **Lucide Icons**, and **Capacitor**. It seamlessly connects with **Google Sheets via Google Apps Script** for cloud logging while maintaining offline local storage capability.

---

## ✨ Key Features

- 💜 **Dark Black & Purple Design System**: Deep obsidian dark mode (`#09090b`), glassmorphic cards, neon purple accents (`#a855f7`), and smooth animations.
- 🎨 **Vector Graphics Category Icons**: Built-in visual icons & color badges for 9 categories:
  - 🍕 **Food** (Utensils)
  - ⛽ **Fuel** (Gas Pump)
  - 🛍️ **Shopping** (Shopping Bag)
  - 🩺 **Medical** (Stethoscope)
  - ✈️ **Travel** (Plane)
  - 🧾 **Bills** (Receipt)
  - 🎬 **Entertainment** (Film)
  - ⚡ **Recharge** (Mobile Top-up)
  - 📦 **Others** (Miscellaneous)
- 📊 **Google Sheets Auto-Syncing**: Log expenses directly into your Google Sheet via a custom Google Apps Script endpoint.
- 📋 **Built-in 1-Click Apps Script Generator**: Copy production-ready Apps Script backend code directly from the app's settings modal.
- 📱 **Hybrid Web & Android App**: Designed for both mobile browsers & native Android devices using **Capacitor**.
- 📈 **Analytics & Budget Tracker**: Monthly spending limits, visual category distribution, and top expense highlights.
- 💾 **Offline First & CSV Export**: Works offline seamlessly and syncs pending transactions when connected to internet.

---

## 🚀 Running the Web App Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start local development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:3000`.

---

## 📱 How to Build the Android APK File

To generate an `.apk` file that can be installed on any Android smartphone:

### Prerequisites:
- Node.js (v18+)
- Android Studio installed on your computer ([Download Android Studio](https://developer.android.com/studio))

### Step-by-Step APK Generation:

1. **Build the Web Bundle**:
   ```bash
   npm run build
   ```

2. **Add the Android Native Platform**:
   ```bash
   npx cap add android
   ```

3. **Sync Web Code to Android**:
   ```bash
   npx cap sync
   ```

4. **Open Project in Android Studio**:
   ```bash
   npx cap open android
   ```

5. **Generate the APK**:
   - In Android Studio, wait for Gradle sync to complete.
   - Go to top menu: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
   - Once completed, click **locate** in the popup notification.
   - Your generated APK file will be located at:
     `android/app/build/outputs/apk/debug/app-debug.apk`

6. Transfer `app-debug.apk` to your Android phone and install!

---

## 🌐 Google Apps Script Setup (Google Sheets Connection)

1. Open a Google Sheet at [sheets.new](https://sheets.new).
2. Go to **Extensions** → **Apps Script**.
3. Copy the updated script code provided in EXPENSO's **Google Sheets Setup Modal** (or from `src/services/googleSheets.js`).
   *(The updated script supports both logging new expenses AND deleting matching rows in Google Sheets when deleted from EXPENSO!)*
4. Paste into Apps Script editor and click **Save (💾)**.
5. Click **Deploy** → **New Deployment**:
   - Select **Web App**
   - Set *Execute as*: **Me**
   - Set *Who has access*: **Anyone**
6. Click **Deploy**, authorize permissions, and copy the **Web App URL**.
7. Paste the Web App URL in EXPENSO settings to enable live two-way syncing & deletion!

---

## 🛠️ Project Tech Stack

- **Frontend**: React 18, Vite 5, JavaScript (ESNext)
- **Icons**: Lucide React
- **Mobile Engine**: `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`
- **Backend Sync**: Google Apps Script REST Web App API
