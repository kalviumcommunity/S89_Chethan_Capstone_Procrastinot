const QuizIcon = ({ width = 24, height = 24, color = 'currentColor' }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 16h8M8 8h8" stroke={color} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export default QuizIcon;