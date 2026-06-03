// ──────────────────────────────────────────────────
// Question Bank — Number Patterns & Sequences (Grade 3)
// ──────────────────────────────────────────────────

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function generateDistractors(correct, count = 3) {
  const distractors = new Set();
  const offsets = [-1000, -100, -10, -5, -2, -1, 1, 2, 5, 10, 100, 1000];
  shuffleArray(offsets).forEach(offset => {
    const d = correct + offset;
    if (d >= 0 && d !== correct && distractors.size < count) distractors.add(d);
  });
  while (distractors.size < count) {
    const d = correct + (distractors.size + 1);
    if (d !== correct) distractors.add(d);
  }
  return shuffleArray([correct, ...distractors]);
}

const diffParams = {
  1: { steps: [2, 5], maxStart: 50 },
  2: { steps: [10], maxStart: 200 },
  3: { steps: [100], maxStart: 5000 },
  4: { steps: [1000], maxStart: 5000 },
  5: { steps: [2, 5, 10, 100, 1000], maxStart: 8000 }
};

function genSequence(diff, isDescending = false) {
  const { steps, maxStart } = diffParams[Math.ceil(diff / 2)] || diffParams[5];
  const step = pick(steps);
  
  let start;
  if (isDescending) {
    start = Math.floor(Math.random() * (maxStart - step * 4)) + step * 4;
  } else {
    start = Math.floor(Math.random() * (maxStart - step * 4));
  }
  start = Math.max(0, start); // Ensure non-negative

  const seq = [];
  for (let i = 0; i < 5; i++) {
    seq.push(isDescending ? start - (i * step) : start + (i * step));
  }
  return { seq, step, isDescending };
}

export function generateSessionQuestions() {
  const questions = [];
  let qId = 1;
  
  for (let world = 0; world < 10; world++) {
    for (let q = 0; q < 10; q++) {
      const diff = Math.min(5, Math.ceil((world * 10 + q + 1) / 20));
      const isDesc = Math.random() > 0.5;
      const { seq, step } = genSequence(diff, isDesc);
      
      const missingIndex = Math.floor(Math.random() * 5);
      const correctAnswer = seq[missingIndex];
      const seqDisplay = seq.map((num, idx) => idx === missingIndex ? '___' : num).join(', ');
      
      questions.push({
        id: qId++,
        world,
        difficulty: diff,
        type: 'sequence_missing',
        questionText: `What is the missing number in this pattern?\n\n${seqDisplay}`,
        options: generateDistractors(correctAnswer),
        correctAnswer
      });
    }
  }
  return questions;
}
