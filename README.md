# 🛍️ E-Commerce Product Listing Assignment

This is a modern, fully responsive **E-commerce product listing application** built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**.  
It demonstrates **performance optimization, type safety, smooth UI animations, and real-world frontend architecture**.

---

## 🚀 Tech Stack

- **Next.js 16 (App Router)**
- **TypeScript** (Type-safe codebase)
- **Tailwind CSS** (Utility-first styling)
- **Context API** (Global search state)
- **SWR** (Optimized data fetching & caching)
- **Motion.dev** (Smooth animations & micro-interactions)
- **Axios** (Centralized API instance)

---

## ✨ Features

### 🧾 Product Listing

- Dedicated **ProductCard** component rendering all products
- Client-side component for **filters** and **sorting**
- Optimized rendering using memoized derived state

### 🔍 Search

- Real-time search across:
  - Product title
  - Tags
  - Category
- Implemented via **Context API** (global search state)

### 🎛️ Filters

- Tags
- Minimum & Maximum Price
- Star Rating
- Clear all filters button

### 🔃 Sorting Options

- Alphabetical (A → Z, Z → A)
- Price (Low → High, High → Low)
- Rating (High → Low)

### 📄 Product Detail Page

- Dynamic route: `/products/[id]`
- Displays all necessary product details
- Includes loading and "not-found" states

### ⚡ Performance Optimization

- **SWR** for data caching and request deduplication
- Centralized **Axios instance**
- Minimal unnecessary re-renders

### 🎨 Animations & UX

- Smooth UI animations using **Motion.dev**
- Micro-animations for:
  - Product cards
  - Filter dropdowns
  - Page transitions

### 📱 Fully Responsive

- Optimized for Desktop, Tablet & Mobile
- Hamburger menu for mobile navigation
- Slide-down mobile search

---

## 🗂️ Folder Structure

app
│
├── components
│ ├── Navbar.tsx
│ ├── Pagination.tsx
│ └── ProductCard.tsx // Product listing, filters & sorting
│
├── products
│ └── [id]
│ ├── page.tsx // Product detail page
│ └── loading.tsx
│
├── layout.tsx
├── page.tsx // Home / Product listing page
├── not-found.tsx
│
lib
├── axios.ts // Axios API instance
└── products.ts // Product types (TypeScript)
│
context
└── SearchContext.tsx // Global search state

---

## 🧠 Architectural Decisions

- **Client Component for Product Listing** (filters & sorting)
- **Context API** for global search
- **SWR** for optimized API data fetching
- **TypeScript** ensures type safety and maintainable code

---

## 📦 Installation & Setup

```bash
git clone <repository-url>
cd <project-folder>
npm install
npm run dev
```
