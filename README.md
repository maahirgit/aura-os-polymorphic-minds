# Aura Retail OS – Polymorphic Minds

##  Description
Aura Retail OS is a modular retail kiosk system designed using Object-Oriented Programming principles and design patterns. The system simulates a real-world automated kiosk with role-based access, dynamic inventory management, and intelligent decision-making for pricing and system behavior.

---

## 🚀 Features

-👤 Role-based system (Admin & User)
-🛒 Product purchase with quantity selection
-📦 Dynamic inventory management
-⚠ Low stock alerts
-🧾 Bill / receipt generation
-📜 Transaction history tracking
-🏥 Multiple system types (Hospital, Metro, University)
-🤖 Automatic decision-making for pricing and system state

---

## 🧠 Design Patterns Used
-**Strategy Pattern**
Used for pricing logic (Standard and Discount pricing)

-**State Pattern**
Represents system modes (Active and Emergency)

-**Observer Pattern**
Handles event notifications (e.g., payment alerts)

-**Factory Pattern**
Creates system types dynamically (Hospital, Metro, University)

---

## ⚙️ System Logic
-**State Decision**
-Stock = 0 → Emergency Mode
-Stock > 0 → Active Mode

-**Pricing Decision**
-Stock > 5 → Discount Pricing
-Stock ≤ 5 → Standard Pricing

---

## 🖥 Sample Output Select Role:
Admin User Enter: 2

Select System Type:
Hospital
Metro University Enter: 1

========= MENU =========

USER MODE

View Items Buy Item View History Exit

Available Items:

medicine (5 left) | Price: 200
mask (10 left) | Price: 50
sanitizer (7 left) | Price: 100
Enter item name: medicine Enter quantity: 2

Processing order... Payment Successful
BILL
Item: medicine Quantity: 2
Total: 400

---
## 🏗 Project Structure Aura-Retail-OS/
├── src/
│ ├── core/
│ ├── inventory/
│ ├── payment/
│ └── patterns/
│ ├── strategy/

│ ├── state/
│ ├── observer/
│ └── factory/
├── simulation/
├── diagrams/
├── docs/
└── README.md

---

## ▶ How to Run

```bash
g++ simulation/main.cpp src/core/KioskCore.cpp src/inventory/InventorySystem.cpp src/payment/PaymentSystem.cpp -o app
.\app.exe

🔮 Future Enhancements
Database integration for persistent storage Advanced dynamic pricing strategies Additional system states (Maintenance, Idle) GUI-based interface
Recommendation system based on demand Integration with real-time data sources
sources
👥 Team – Polymorphic Minds
Krisha Doshi
Maahir Shah
Rishika Shah
Meet Sheth
