// ──────────────────────────────────────────────────
// Narration Scripts — Number Patterns & Sequences
// Each function returns an array of {text, style} segments
// ──────────────────────────────────────────────────
import { say, ask, cheer, celebrate, instruct, emphasize } from './audio';

export function introNarration() {
  return [
    cheer("Welcome to Number Patterns and Sequences!"),
    say("Today, we are going to discover amazing number patterns."),
    ask("What happens when we count by twos, fives, tens, hundreds, or even thousands?"),
    say("Are you ready to explore number patterns and solve some mysteries?"),
  ];
}

export function wonderNarration(questionText) {
  return [
    ask(questionText),
  ];
}

export function wonderDiscoverNarration() {
  return [
    celebrate("Great thinking!"),
    say("Let us discover the answer in our story!"),
  ];
}

export function getStoryNarration(slideIndex) {
  const narrations = [
    [say("John is waiting at the train station. The display shows trains arriving at minutes 5, 10, 15, 20."), ask("Can you see the pattern? The trains come every 5 minutes!")],
    [say("Sarah visits the market. Apples cost 100, 200, 300, 400 cents."), emphasize("The price goes up by 100 each time. That is a number pattern!")],
    [say("Mike counts the steps on a staircase: 2, 4, 6, 8, 10."), say("Each step adds 2 more. When we add the same number each time, that is an ascending pattern.")],
    [say("Aisha has 50 stickers. She gives away 10 each day: 50, 40, 30, 20, 10."), emphasize("When we subtract the same number each time, that is a descending pattern.")],
    [say("Luca looks at house numbers: 1000, 2000, 3000, 4000."), celebrate("Wow! Counting by thousands! The rule is plus 1000.")],
    [say("Now you know what number patterns are!"), cheer("Patterns are everywhere, and you can find them!"), instruct("Let us practice making patterns ourselves.")],
  ];
  return narrations[slideIndex] || [say("Let us continue!")];
}

export function simulateStation1Intro() {
  return [instruct("Look at the number line. Find the missing number by figuring out the pattern rule!")];
}
export function simulateStation2Intro() {
  return [instruct("Look at these numbers. Which ones show a correct pattern? Tap to check!")];
}
export function simulateStation3Intro() {
  return [instruct("Now fill in the missing number. Use the number pad to type your answer!")];
}
export function simulateStation4Intro() {
  return [instruct("Is this pattern going up or down? Choose ascending or descending!")];
}
export function simulateStation5Intro() {
  return [instruct("Let's build a pattern! Follow the rule and pick the next numbers.")];
}

export function playWorldIntro(worldName) {
  return [cheer(`Welcome to ${worldName}!`), instruct("Answer the questions. You can do it!")];
}
export function playReadQuestion(questionText) {
  return [ask(questionText)];
}
export function playCorrectNarration() {
  return [celebrate("Correct! Well done!")];
}
export function playWrongNarration(correctAnswer) {
  return [say(`Not quite. The answer is ${correctAnswer}.`), cheer("Try the next one!")];
}
export function playWorldComplete(worldName, stars) {
  const starText = stars === 3 ? 'three' : stars === 2 ? 'two' : stars === 1 ? 'one' : 'zero';
  return [celebrate(`You completed ${worldName} with ${starText} stars!`)];
}
export function reflectNarration() {
  return [ask("What did you learn about number patterns?"), say("How confident do you feel about number patterns?")];
}
