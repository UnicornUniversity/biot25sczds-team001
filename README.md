# BIOT-Team-001

## 📌 O projektu

**SimpleGuard** je aplikace určená pro monitorování objektů pomocí IoT technologie. Systém je postaven na mikrokontroléru **HARDWARIO Core Module** s akcelerometrem připevněným ke dveřím, který detekuje neoprávněné manipulace.

## 👥 Rozdělení rolí v týmu

- **🔹 Projektový manažer:** Marek Ostrihoň  
- **🔹 Backend:** Šimon Kristín, Tomáš Trnečka  
- **🔹 Frontend:** František Peterka, Anastasie Žďárská
- **🔹 Hardware:** HazarYasin Sezgin  
- **🔹 Dokumentace:** Filip Šmehyl

## 🛠 Použité technologie

- **Backend:** Node.js (Express.js), MongoDB  
- **Frontend:** React.js  
- **Hardware:** HARDWARIO Core Module  
- **Komunikace:** MQTT / HTTPS  

## 🚀 Hlavní vlastnosti

- 📡 **Sběr dat** z akcelerometru umístěného na dveřích  
- 🔔 **Detekce neoprávněných pohybů** a odesílání upozornění  
- 🌐 **Zpracování a vizualizace dat** v cloudové aplikaci  
- 🛠 **Možnost rozšíření** o další senzory HARDWARIO  

## 🏗 Architektura řešení

```plaintext
IoT node (Core Module) →→MQTT→→ Gateway (Radio Dongle) →→HTTP→→ Backend (Node.js) →→HTTP→→ Frontend (Next.js)
```



## 📅 Milníky projektu

<div align="center">
 <img src="/BIOT.png" width="600px">
</div>

**Nejbližší milník je vytvoření Business Request, který by měl být splněn do pátku 21.3. před kozultací.**

### 🎨 Design

| **Code** | **Description** |
|----------|---------------------------------------------------------------|
| M1       | Business Request ⇒ Popsání klíčových User Stories             |
| M2       | Business Model ⇒ Popis aktérů, produktů a klíčových BUCs       |
| M3       | Application Model ⇒ Návrh klíčových koncových bodů a schémat (datový model) |
| M4       | Application Model ⇒ Návrh technického řešení IoT části (IoT node + gateway) |
| M5       | Application Model ⇒ Základní návrh frontend rozhraní           |
| M6       | Application Model ⇒ Základní návrh frontend komponent          |

### 💻 Vývoj

| **Code** | **Description** |
|----------|--------------------------------------------------|
| M1       | Vytvoření projektu a první commit v Git         |
| M2       | Implementace backendu                           |
| M3       | Implementace IoT nodu a gateway                 |
| M4       | Implementace frontendu                         |
| M5       | Nasazení aplikace do cloudu                    |

