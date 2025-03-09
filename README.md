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

### 🎨 Design

**Termíny pro jednotlivé milníky jsou vždy v pátky, protože v sobotu probíhají konzultace.**

| **Code** | **Description** | **Termín** |
|----------|---------------------------------------------------------------|----------|
| M1       | Business Requests ⇒ Popsání klíčových User Stories             | 21.3.    |
| M2       | Business Model ⇒ Popis aktérů, produktů a klíčových BUCs       | 4.4.    |
| M3       | Application Model ⇒ Návrh klíčových koncových bodů a schémat (datový model) | 11.4.    |
| M4       | Application Model ⇒ Návrh technického řešení IoT části (IoT node + gateway) | 18.4.    |
| M5       | Application Model ⇒ Základní návrh frontend rozhraní           | 9.5.    |
| M6       | Application Model ⇒ Základní návrh frontend komponent          | 9.5.    |

### 💻 Vývoj

| **Code** | **Description** | **Termín** |
|----------|--------------------------------------------------|----------|
| M1       | Vytvoření projektu a první commit v Git         | 21.3.    |
| M2       | Implementace backendu                           | 18.4.    |
| M3       | Implementace IoT nodu a gateway                 | 2.5.    |
| M4       | Implementace frontendu                         | 9.5.    |
| M5       | Nasazení aplikace do cloudu                    | 9.5.    |


## 🔗 Dokumentace

| **Sekce**               | **Popis**                                       |
|-------------------------|------------------------------------------------|
| <a href="https://uuapp.plus4u.net/uu-managementkit-maing02/38744216cb324edca986789798259ba9/document?oid=67c7641212501e7e1b9ec04e&pageOid=67c7641b68cbf80542ebd682" target="_blank">**Business Requests**</a>   | Popsání klíčových User Stories                 |
| <a href="https://uuapp.plus4u.net/uu-managementkit-maing02/38744216cb324edca986789798259ba9/document?oid=67c74c4f12501e7e1b9e53bc&pageOid=67c74c5868cbf80542eb6b19" target="_blank">**Business Model**</a>         | Popis aktérů, produktů a klíčových BUCs        |
| <a href="https://uuapp.plus4u.net/uu-managementkit-maing02/38744216cb324edca986789798259ba9/document?oid=67c74c4468cbf80542eb6987&pageOid=67c74c4b12501e7e1b9e533f" target="_blank">**Application Model**</a>   | Návrh backendu a frontendu       |
