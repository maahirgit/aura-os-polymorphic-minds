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
