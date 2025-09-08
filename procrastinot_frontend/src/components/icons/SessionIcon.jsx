const SessionIcon = ({ width = 24, height = 24, color = 'currentColor', ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color }}
    {...props}
  >
    <polygon
      points="9,6 9,18 17,12"
      fill={color}
    />
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export default SessionIcon;