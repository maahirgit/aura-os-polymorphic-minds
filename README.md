<<<<<<< HEAD
# Aura Retail OS: Mission Control Dashboard 🚀

An autonomous, professional-grade retail management infrastructure for the Zephyrus Smart City, powered by **10 Object-Oriented Design Patterns**.

## 🏗️ Architecture Overview
Aura Retail OS is built using a **Node.js/Express** backend and a **React/Vite** frontend. It simulates an adaptive network of retail kiosks that can autonomously recover from failures and dynamically adjust to emergency city states.

## 🛡️ The 10 Design Patterns
This project demonstrates the implementation of 10 classic and advanced design patterns:

1.  **Singleton**: Centralized system configuration via the `Registry`.
2.  **Factory Method**: Automated instantiation of different Kiosk types (Pharmacy, Food, Emergency).
3.  **Strategy**: Dynamic pricing policies (Standard, Discount, and Emergency distributions).
4.  **State**: Autonomous operational modes (Active, Maintenance, and Emergency Lockdown).
5.  **Command**: Atomic transaction execution with snapshot-based **Rollback** capabilities.
6.  **Observer**: Event-driven notification system for low stock and system alerts.
7.  **Chain of Responsibility**: 3-stage autonomous failure recovery (Retry -> Recalibrate -> Escalate).
8.  **Memento**: State snapshots allowing users to create "Checkpoints" and restore node configurations.
9.  **Decorator**: Dynamic hardware upgrades (Solar Power, Advanced Cooling) added at runtime.
10. **Proxy**: Secure administrative access layer for modifying sensitive infrastructure.

## 🚀 Deployment
- **Local**: `node web/backend/server.js`
- **Cloud**: Ready for one-click deployment to **Render** via `render.yaml`.
- **Docker**: Containerized for cross-platform stability.

## 👥 Team Work Distribution
- **Architecture & Core Patterns**: Implementation of the 10 patterns in the logic layer.
- **Mission Control UI**: High-fidelity React dashboard and real-time telemetry visualization.
- **API & Systems Integration**: Secure backend communication and pattern orchestration.
- **DevOps & Documentation**: Deployment configuration, Dockerization, and Audit logging.

---
*Developed for the Aura Retail OS Smart City Project.*
=======
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
>>>>>>> 556f00ed8509584c67b7b68f5faa524fee67ee37
