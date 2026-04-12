# OfficeRec

A Nepali government office record-keeping web application for managing citizen tax records. Built with React and Firebase, deployed on GitHub Pages.

🌐 **Live app:** https://nugasnakarmi.github.io/OfficeRec

---

## Overview

OfficeRec allows government office staff and citizens to manage property and asset tax records across five categories: land, vehicle, business, house, and rent (Bahal). It implements a two-role system — regular users view their own records, while admins can search, add, and edit all citizens' records.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 16** (class components) | UI framework |
| **Firebase 5** (Auth + Firestore + Storage) | Backend — authentication, database, file storage |
| **React Router 4** | Client-side navigation |
| **Reactstrap / Bootstrap 4** | UI components and styling |
| **react-content-loader** | Loading skeleton animations |
| **ad-bs-converter** | Nepali AD ↔ BS date conversion |
| **gh-pages** | Deployment to GitHub Pages |

---

## Features

- **Authentication** — Email/password login via Firebase Auth
- **Role-based access** — User vs. Admin, stored as `isAdmin` flag in Firestore
- **User dashboard** — Profile info and photo from Firebase Storage
- **Tax record views** — Cards for each of: land tax, vehicle tax, business tax, house tax, rent tax (Bahal)
- **Admin panel** — Search all users, view records, open detail popup
- **Add User** — Admin creates Firebase Auth account + Firestore document in one step
- **Edit records** — Admin can edit any user's tax records inline

---

## Firestore Data Model

```
UserBase (collection)
  └── {email} (document)
        ├── Name
        ├── Citizenship Number
        ├── Date of Birth
        ├── isAdmin
        └── Subcollections:
              ├── land-tax/
              ├── vehicle-tax/
              ├── business-tax/
              ├── house-tax/
              └── rent-tax/
```

---

## Project Structure

```
src/
├── config/
│   ├── fire.js          # Firebase initialisation
│   └── admin.js
├── res/                 # Static image assets
├── App.js               # Auth listener → routes to Login or Home
├── home.js              # Role check, layout (sidebar + content pane)
├── login.js             # Login form
├── MainWindow.js        # User dashboard (profile info + photo)
├── AdminWindow.js       # Admin dashboard (searchable user list)
├── Details.js           # Fetches & renders all tax subcollections
├── Land.js / EditLand.js
├── Vehicle.js / EditVehicle.js
├── Business.js / EditBusiness.js
├── House.js / EditHouse.js
├── Bahal.js / EditBahal.js
├── Advertisement.js / EditAdvertisement.js
├── AddUser.js           # Admin: create new user
├── precords.js          # Admin: edit user tax records
├── Popup.js             # Modal overlay for user details
├── RecordList.js        # Clickable user row in admin list
├── Sidebar.js           # Nav bar for regular users
├── AdminSidebar.js      # Nav bar for admins
└── FixDate.js           # Date formatting utility
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 10
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start development server |
| `npm test` | Run tests in watch mode |
| `npm run build` | Production build |
| `npm run deploy` | Build and publish to GitHub Pages |
