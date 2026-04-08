Aura Retail OS

Polymorphic Minds

Description

Aura Retail OS is a modular retail kiosk system based on object-oriented design.  

This is a partial implementation of the system proposed in Subtask 1.

\---

Implemented Features

Kiosk Core system

Basic Inventory and Payment modules (partial)

Strategy Pattern (Pricing)

State Pattern (Kiosk Modes)

\---

Design Patterns

Strategy Pattern  

Used for dynamic pricing (Standard, Discount).

State Pattern  

Used for kiosk modes (Active, Emergency).

\---

Simulation

Demonstrates:

State handling

Pricing calculation

Output:

Kiosk is Active

Discount Applied

Final Price: 80



project structure

Aura-Retail-OS/

│

├── src/

│ ├── core/

│ ├── inventory/

│ ├── payment/

│ └── patterns/

│ ├── strategy/

│ └── state/

│

├── simulation/

├── diagrams/

├── docs/

└── README.md

How to Run

g++ simulation/main.cpp src/core/KioskCore.cpp src/inventory/InventorySystem.cpp src/payment/PaymentSystem.cpp -o app

./app



\---

Future Enhancements

The current system is a partial implementation. The following improvements can be made:

Integration of Inventory System with real-time stock updates

Advanced Payment System with multiple payment methods and failure handling

Additional kiosk states such as Maintenance and Idle modes

Implementation of more pricing strategies such as dynamic and emergency pricing

Event-driven communication using Observer Pattern

Failure handling mechanisms using advanced design patterns

Improved scalability and support for multiple kiosks

\---

Team – Polymorphic Minds

Krisha Doshi

Maahir Shah

Rishika Shah

Meet Sheth

