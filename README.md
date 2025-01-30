<div align="center">

# 🚀 NEXT.JS BOILERPLATE PROJECT

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-1.0-f9f1e1?style=for-the-badge&logo=bun)](https://bun.sh/)

A modern, type-safe, and feature-rich Next.js boilerplate with best practices baked in.

[Key Features](#key-features) •
[Getting Started](#getting-started) •
[Project Structure](#project-structure) •
[Documentation](#documentation)

</div>

---

## ✨ Key Features

- 🔥 **Next.js 15.1.6** with TypeScript support
- 🔒 **Authentication** via NextAuth.js
- 💅 **TailwindCSS** for modern styling
- 🎨 **Shadcn UI** components based on Radix UI
- 🏗️ **Atomic Design** principles
- 📱 **Responsive** layouts
- 🌓 **Dark Mode** support
- 🚀 **Bun** for faster development

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Proyecto-de-Ingenieria-III-EIA/boilerplate
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   bun dev
   ```

## 🛠️ Tech Stack

### Core

- ⚡ **Next.js** - React framework
- 📘 **TypeScript** - Type safety
- 🎨 **TailwindCSS** - Styling
- 🔒 **NextAuth.js** - Authentication
- 🏃 **Bun** - Fast JavaScript runtime

### UI Components

- 🎯 **Radix UI** - Accessible components
- 🎨 **Shadcn UI** - Beautiful UI components
- 📱 **Lucide React** - Icons
- 🎭 **Class Variance Authority** - Component variants

## 📜 Available Scripts

- `bun dev` - Start development server
- `bun build` - Create production build
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun test` - Run tests
- `bun format` - Format code with Prettier

## 🔐 Environment Variables

| Variable            | Description            | Required |
| ------------------- | ---------------------- | -------- |
| `AUTH_SECRET`       | NextAuth.js secret key | Yes      |
| `AUTH_AUTH0_ID`     | Auth0 Client ID        | Yes      |
| `AUTH_AUTH0_SECRET` | Auth0 Client Secret    | Yes      |
| `AUTH_AUTH0_ISSUER` | Auth0 Domain URL       | Yes      |

## 📐 ESLint Configuration

Our ESLint setup ensures code quality with:

- 🎯 TypeScript best practices
- 🏹 Arrow function components
- 🚫 Import restrictions
- 🪝 React Hooks guidelines
- 📊 Complexity limits
- 🎨 Prettier integration
