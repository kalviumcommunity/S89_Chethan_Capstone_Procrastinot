const ChallengeIcon = ({ width = 24, height = 24, color = 'currentColor', ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color }}
    {...props}
  >
    <path
      d="M6 9L12 2L18 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2V22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 22H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="18"
      r="2"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export default ChallengeIcon;