# ♟️ Checkers Game (React / Next.js)

Een moderne, volledig interactieve **Checkers/Dammen** game gebouwd met **Next.js, TypeScript en Context Providers**.  
Dit project bevat een slimme AI-tegenstander, real-time animaties, timer-tracking en alle klassieke regels van het 8×8 checkers-spel.

---

## 🚀 Features

### 🎮 Gameplay

-   8×8 bord met correcte donkere vlakken
-   Stukken bewegen diagonaal naar voren
-   Verplicht slaan
-   Reguliere stukken mogen **voor- én achterwaarts slaan**
-   Meersprongen (multi-captures)
-   Koningen bewegen 1 stap in alle richtingen
-   Koningen slaan ook voor/achterwaarts
-   Geen “flying kings” zoals in internationale dammen
-   Automatische promotie tot koning bij bereiken van achterste rij

### 🤖 AI Opponent

-   Automatische beurtwisseling
-   AI speelt als **black**
-   Voert multi-captures correct uit
-   Reactieve setState + useCallback optimalisatie
-   Voorkomt infinite loops

### 🕒 Timer System

-   Timer start bij eerste speleractie
-   Timer stopt automatisch bij winst
-   Reset bij nieuwe wedstrijd

### 🧠 Game Logic

-   Automatische win-detectie
-   Geen stukken = verlies
-   Geen legale zetten meer = verlies
-   Verplicht-slaan systeem
-   Highlight van geldige zetten

### 🎨 UI / Animaties

-   Moderne dark UI met Tailwind
-   Highlight geselecteerde stukken
-   Rode ring rond stukken die verplicht moeten slaan
-   Animaties bij verplaatsing en captures
-   Startscherm met spelernaam

---

## 📜 Game Rules (Variant A)

Deze app volgt klassieke **US / Anglo-American Checkers** regels, met één belangrijke extra:  
✔ normale stukken mogen **ook achterwaarts slaan**.

### 📌 Board Setup

-   8×8 bord
-   Enkel donkere vakken worden gebruikt
-   Wit begint

### 🎯 Movement

-   Stukken bewegen 1 diagonaal vakje naar voren
-   Koningen bewegen 1 diagonaal vakje in alle richtingen

### ⚔️ Capturing

-   Slaan is verplicht
-   Slagen mag **vooruit én achteruit** voor alle stukken
-   Meersprongen zijn verplicht
-   Captures worden direct verwerkt
-   Je hoeft niet de langste reeks te kiezen

### 👑 Kings

-   Promotie bij bereiken van achterste rij
-   Koningen bewegen/slaan 1 stap in 4 diagonale richtingen
-   Geen flying kings

### 🏆 Win Conditions

-   Je wint wanneer alle tegenstanderstukken verdwenen zijn
-   Of wanneer tegenstander geen legale zet meer heeft
-   Bij patstelling / geen mogelijke winst → remise

---

## 🧩 Tech Stack

| Category   | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js (App Router)    |
| Language   | TypeScript              |
| State      | React Context Providers |
| Styling    | Tailwind CSS            |
| AI Logic   | Pure JS decision engine |
| Animations | CSS Transitions         |
| Build      | Turbopack               |

---

## 🗂 Belangrijkste Projectstructuur

## 🧩 Tech Stack

| Category   | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js (App Router)    |
| Language   | TypeScript              |
| State      | React Context Providers |
| Styling    | Tailwind CSS            |
| AI Logic   | Pure JS decision engine |
| Animations | CSS Transitions         |
| Build      | Turbopack               |

---

## 🗂 Belangrijkste Projectstructuur

---

## ▶️ Installatie & Gebruik

### 1️⃣ Dependencies installeren

```bash
npm install
```
