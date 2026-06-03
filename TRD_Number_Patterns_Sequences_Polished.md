# ⚙️


### NUMBER PATTERNS & SEQUENCES



### Gamified Learning Platform



### Grade 3 Mathematics · Whole Numbers up to 10,000



### ─────────────────────────────────────────



### Technical Requirements Document (TRD) · Version 1.0



### Based on: github.com/dsamyak/equal · equal-tau.vercel.app



### Date: June 2026 · Stack: React + Vite + Framer Motion + Tailwind CSS



## Table of Contents



### 1. Technical Overview & Architecture



### 2. Technology Stack



### 3. Project Structure



### 4. Component Architecture



### 5. State Management



### 6. Randomisation Engine



### 7. Simulation Components — Technical Specification



### 8. Audio System



### 9. Gamification Engine



### 10. Routing & Navigation



### 11. Data Schemas



### 12. API Contracts (Internal)



### 13. Performance & Optimisation



### 14. Testing Strategy



### 15. Build & Deployment



### 16. CI/CD Pipeline



### 17. Browser Compatibility



### 18. Accessibility Implementation



### 19. Security Considerations



### 20. Integration with Intellia SG Platform



### 1. Technical Overview & Architecture


The Number Patterns & Sequences lesson is a client-side React Single Page Application (SPA). It has no backend of its own — all state is managed in React context and persisted to browser localStorage. It is designed to be deployed as a static build and embedded within or linked from the Intellia SG course platform at intelliasg.com/courses/grade-3-math/lessons/number-patterns-and-sequences/.


### 1.1 High-Level Architecture Diagram (described)



### Entry point: index.html → main.jsx → App.jsx


App.jsx: wraps application in GameProvider (context), AudioProvider, and React Router


### Router: 5 routes — /, /district/:id, /practice/:id, /boss, /complete


Each route renders a Scene component that composes: NarrativeCard + SimulationWidget + QuestionEngine


### GameProvider: holds global state (XP, badges, progress, streak)



### AudioProvider: manages Howler.js audio pool


QuestionEngine: consumes questions-[section].json, applies SeededRNG, renders question types


### 2. Technology Stack



### 3. Project Structure


The directory structure mirrors the dsamyak/equal repository with extensions for the number-patterns lesson:


### 4. Component Architecture



### 4.1 Component Hierarchy


Every screen composes three layers: (1) Scene layer manages data and logic, (2) Layout layer positions elements, (3) Leaf components render specific UI. This mirrors the equal repo pattern.


### 4.2 Key Component Interfaces (TypeScript)



### 5. State Management



### 5.1 Global Game State (Zustand / Context)



### 5.2 localStorage Persistence



### Key: intelliasg_lesson_1_7_state



### Persisted fields: completedSections, totalXP, badges, currentDistrict


Not persisted: sessionXP, streak (per-session only), audioEnabled (user preference in separate key)

On app load: rehydrate from localStorage. If corrupted/absent, start fresh.


### Automatic save on every state mutation via Zustand middleware



### 6. Randomisation Engine



### 6.1 SeededRNG Class



### 6.2 QuestionFactory



### 6.3 Question Pool Guarantees



### Minimum 30 unique question configurations per section



### No two consecutive questions share the same rule



### No question in a session repeats within the same section



### Boss level draws from all sections ensuring at least 2 questions per type



### 7. Simulation Components — Technical Specification



### 7.1 Simulation Config Schema



### 8. Audio System



### 8.1 AudioEngine Implementation



### 8.2 Audio File Specifications



### 8.3 Autoplay Handling


On first user interaction (click/tap anywhere), AudioContext is unlocked via Howler.ctx.resume()

Splash/start screen requires explicit click — satisfies all browser autoplay policies

If audio context suspended, AudioEngine queues playback and fires on context resume


### 9. Gamification Engine



### 9.1 XP Calculation



### 10. Routing & Navigation


Navigation uses React Router 6 useNavigate. Route guards implemented as a custom RequireProgress wrapper component that checks GameState.completedSections.


### 11. Data Schemas



### 11.1 Question Template Schema (JSON)



### 11.2 Narrative Data Schema



### 12. API Contracts (Internal)


This application has no external API. The /api directory in the repository (mirroring the equal repo structure) may contain optional serverless functions for LMS integration. Internal contracts are between React components and the engine layer:


### 13. Performance & Optimisation



### 13.1 Bundle Strategy



### 13.2 Performance Targets



### 14. Testing Strategy



### 15. Build & Deployment



### 15.1 Build Process



### 15.2 Deployment


Static build output in /dist deployed to Vercel (matches equal-tau.vercel.app pattern)

Environment: Production URL embedded in Intellia SG course as iframe or direct link


### CDN: Vercel Edge Network — global distribution


Custom domain: lesson.intelliasg.com/grade-3/number-patterns (or embedded in course)


### Environment variables: VITE_LESSON_ID=1_7, VITE_ANALYTICS_ID (optional)



### 16. CI/CD Pipeline



### 17. Browser Compatibility



### 18. Accessibility Implementation



### 19. Security Considerations



### No user authentication or PII collected in this client-only application



### localStorage data contains only lesson progress — no sensitive data


Content Security Policy header configured in Vercel vercel.json: script-src self, style-src self unsafe-inline, img-src self data:


### All external CDN resources (Google Fonts, cdnjs) included in CSP allowlist


No third-party analytics without explicit consent — use privacy-first alternative (Plausible) if needed


### COPPA compliant: no data collected from users under 13



### GDPR compliant: no cookies or tracking, localStorage is first-party only



### 20. Integration with Intellia SG Platform



### 20.1 Embed Options



### 20.2 postMessage API (iframe integration)


This TRD is the definitive technical specification for implementation. All developers should align their work to this document. Updates require review by the technical lead.