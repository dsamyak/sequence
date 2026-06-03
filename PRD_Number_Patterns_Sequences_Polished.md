# 🔢


### NUMBER PATTERNS & SEQUENCES



### Gamified Learning Platform



### Grade 3 Mathematics · Whole Numbers up to 10,000



### ─────────────────────────────────────────



### Product Requirements Document (PRD) · Version 1.0



### For: Intellia SG · intelliasg.com/courses/grade-3-math



### Date: June 2026 · Prepared for Global Deployment



## Table of Contents



### 1. Executive Summary



### 2. Product Vision & Goals



### 3. Target Audience & User Personas



### 4. Scope & Out of Scope



### 5. Learning Framework & Pedagogical Approach



### 6. Story & Narrative Design



### 7. Module Structure & Content Outline



### 8. Gamification Framework



### 9. Simulation-Based Learning Model



### 10. Practice & Assessment System



### 11. Audio & Multimedia Requirements



### 12. Accessibility & Localization



### 13. Functional Requirements



### 14. Non-Functional Requirements



### 15. UI/UX Design Principles



### 16. Success Metrics & KPIs



### 17. Risks & Mitigations



### 18. Appendix: Global Curriculum Alignment



### 1. Executive Summary


This Product Requirements Document defines the complete specification for a gamified, simulation-based educational website targeting Grade 3 students globally on the topic of Number Patterns and Sequences within Whole Numbers up to 10,000. The platform is a lesson (1.7) within the Intellia SG Grade 3 Mathematics course and must integrate seamlessly into the course structure at intelliasg.com/courses/grade-3-math/.

The platform is designed as a React-based single-page application that follows a story-driven, simulation-first learning model inspired by the Equal Groups reference implementation (equal-tau.vercel.app) and the dsamyak/equal GitHub repository. Students follow a cast of globally-named characters — John, Sarah, Mike, Aisha, and Luca — through an interactive adventure where mathematics is the engine of the story.


### 2. Product Vision & Goals



### 2.1 Vision Statement


To create the most engaging, comprehensive, and globally-accessible gamified math lesson on number patterns and sequences for 8–9 year old learners — one that students would voluntarily return to, and teachers would recommend as a model lesson.


### 2.2 Strategic Goals



### 3. Target Audience & User Personas



### 3.1 Primary User: The Student



### 3.2 Secondary Users



### 4. Scope



### 4.1 In Scope



### Lesson 1.7: Number Patterns and Sequences (within Whole Numbers up to 10,000)



### Ascending patterns (counting up by a fixed rule: +2, +5, +10, +100, +1000)



### Descending patterns (counting down by a fixed rule: −2, −5, −10, −100, −1000)



### Mixed-start sequences (starting from any number up to 9,000)



### Finding the missing number in a sequence



### Identifying the rule of a sequence



### Completing a sequence (fill in next 2–3 terms)



### Visual number line and number grid simulations



### Story-based introduction and character-driven narrative



### Fully randomised, non-repeating practice questions per session



### Audio narration and sound effects for all key interactions



### Gamification: XP, badges, streaks, leaderboard-lite



### Mobile-responsive React application



### 4.2 Out of Scope



### Other lessons in Grade 3 Math (handled by respective lesson modules)



### Multiplication or division patterns (covered in later lessons)



### Fraction patterns (out of scope for Grade 3 Number Patterns)


Backend user accounts or persistent cross-session progress (to be handled by Intellia SG platform)


### Teacher analytics dashboard (separate product)



### 5. Learning Framework & Pedagogical Approach



### 5.1 The "Explore → Learn → Simulate → Practice → Celebrate" Loop


Every section of the lesson follows a five-step pedagogical loop, based on constructivist learning theory and proven gamified EdTech design:


### 5.2 Learning Objectives (Aligned to Global Standards)



### 6. Story & Narrative Design



### 6.1 Story World: The Pattern Portal


The lesson is set in a magical city called Numerica where everything runs on patterns. One day, a mischievous character called The Scrambler sneaks in and breaks all the number sequences — train schedules, market prices, staircase steps — throwing the city into chaos.

A team of four friends must travel through five districts of Numerica and fix the broken patterns to restore order. Each district introduces a new level of difficulty and a new type of pattern challenge.


### 6.2 Main Characters



### 6.3 Story Arc & District Map



### 7. Module Structure & Content Outline



### 7.1 Lesson 1.7 — Full Content Map



### 8. Gamification Framework



### 8.1 Points & XP System



### 8.2 Badge System



### 8.3 Progress Indicators



### District map at top of screen shows unlocked/locked areas



### XP bar fills up progressively with animations



### Character reactions change based on performance (happy, encouraging, surprised)



### Session streak counter displayed with fire emoji animation



### 9. Simulation-Based Learning Model



### 9.1 Simulation Designs



### 9.2 Simulation Principles



### Every simulation is manipulable before any instruction — students explore first


Simulations give immediate visual feedback — wrong moves are shown, not just rejected

Simulations scale in complexity: easy values first, large values (to 10,000) as lesson progresses


### All simulations accessible on touch (drag, tap) and keyboard/mouse



### 10. Practice & Assessment System



### 10.1 Question Types



### 10.2 Randomisation Engine



### Every session generates a fresh seed for question randomisation



### Starting numbers pulled from a pool of 50+ validated starting points


Rules randomised from: +2, +3, +4, +5, +10, +25, +50, +100, +200, +500, +1000 and their negatives


### No two consecutive questions use the same rule


Difficulty progression: small numbers (under 100) in first 2 practices, large numbers (up to 10,000) from Practice B onwards


### Boss Level randomises across all types and all difficulty levels



### 10.3 Hint & Retry System


On first wrong answer: character gives a contextual hint ("Try subtracting the first number from the second — what do you get?")

On second wrong answer: worked example shown step-by-step with the same question

On third wrong answer: answer revealed with full explanation; question marked for review


### No punitive streaks — wrong answers reset streak only, never deduct XP



### 11. Audio & Multimedia Requirements



### 11.1 Audio Design Philosophy


Audio is a core part of the experience, not an add-on. All character dialogue is narrated in a warm, upbeat voice. Sound effects reinforce every correct action. Background music is ambient, non-distracting, and loopable. The audio style matches the reference application — conversational, encouraging, and child-appropriate.


### 11.2 Audio Assets Required



### 11.3 Audio Controls



### Master volume slider accessible at all times (top-right corner)



### Music and SFX independently toggleable



### Narration can be replayed by clicking on character speech bubble



### Autoplay narration on section start (with browser autoplay handling)



### 12. Accessibility & Localization



### 12.1 Accessibility Standards



### WCAG 2.1 Level AA compliance



### All interactive elements keyboard navigable



### Colour is never the sole differentiator — patterns also use shape and text



### Font minimum 16px for body text; 20px+ for question text



### Audio narration provides full content parity for non-readers



### Screen reader-compatible (ARIA labels on all simulation elements)



### High contrast mode support



### 12.2 Localization



### Primary language: English (International)



### i18n-ready architecture: all strings in a JSON locale file



### Date/number formatting locale-aware (commas vs periods)



### Story names (John, Sarah, Mike, Aisha, Luca) are deliberately globally diverse



### 13. Functional Requirements



### 13.1 Core Functional Requirements



### 14. Non-Functional Requirements



### 15. UI/UX Design Principles



### 15.1 Design Language


The visual design strictly follows the equal-tau.vercel.app reference implementation and the dsamyak/equal repository structure. Key design characteristics:


### 15.2 Screen Layouts


Header/HUD: Character portrait, XP bar, streak counter, lesson progress dots, volume control

Content Area: Story narration card + simulation widget side by side (desktop) / stacked (mobile)

Question Area: Full-width question card with large font, answer input, and character hint bubble

Celebration Overlay: Full-screen confetti animation with badge reveal and XP counter

District Map: Visual progress map showing 5 districts with locked/unlocked states


### 16. Success Metrics & KPIs



### 17. Risks & Mitigations



### 18. Appendix: Global Curriculum Alignment


This PRD is a living document and will be updated as the product evolves. All stakeholders should ensure they reference the latest version.