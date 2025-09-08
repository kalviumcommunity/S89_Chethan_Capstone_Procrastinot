const SkillsIcon = ({ width = 24, height = 24, color = 'currentColor', ...props }) => (
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
      d="M2 3H8C9.1 3 10 3.9 10 5V19C10 20.1 9.1 21 8 21H2V3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 3H16C14.9 3 14 3.9 14 5V19C14 20.1 14.9 21 16 21H22V3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 12H14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="8"
      r="2"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export default SkillsIcon;