export default function QuestionRenderer({ q }) {
  if (!q) return null;
  return (
    <div className="question-text">
      {q.questionText.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          <br/>
        </span>
      ))}
    </div>
  );
}
