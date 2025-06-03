import React from "react";

export const SnakeIcon = ({ className = "", size = 60 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
    }}
  >
    <defs>
      <radialGradient id="snakeBodyGradient" cx="50%" cy="30%">
        <stop offset="0%" stopColor="#7CB342" />
        <stop offset="40%" stopColor="#689F38" />
        <stop offset="100%" stopColor="#388E3C" />
      </radialGradient>
      <radialGradient id="snakeHeadGradient" cx="40%" cy="30%">
        <stop offset="0%" stopColor="#8BC34A" />
        <stop offset="60%" stopColor="#689F38" />
        <stop offset="100%" stopColor="#2E7D32" />
      </radialGradient>
    </defs>

    {/* Snake body segments */}
    <ellipse
      cx="25"
      cy="75"
      rx="8"
      ry="6"
      fill="url(#snakeBodyGradient)"
      transform="rotate(-20 25 75)"
    />
    <ellipse
      cx="35"
      cy="65"
      rx="9"
      ry="7"
      fill="url(#snakeBodyGradient)"
      transform="rotate(10 35 65)"
    />
    <ellipse
      cx="50"
      cy="55"
      rx="8"
      ry="6"
      fill="url(#snakeBodyGradient)"
      transform="rotate(-15 50 55)"
    />
    <ellipse
      cx="65"
      cy="45"
      rx="9"
      ry="7"
      fill="url(#snakeBodyGradient)"
      transform="rotate(25 65 45)"
    />
    <ellipse
      cx="75"
      cy="30"
      rx="8"
      ry="6"
      fill="url(#snakeBodyGradient)"
      transform="rotate(-10 75 30)"
    />

    {/* Snake head */}
    <ellipse
      cx="80"
      cy="20"
      rx="10"
      ry="8"
      fill="url(#snakeHeadGradient)"
      transform="rotate(15 80 20)"
    />

    {/* Eyes */}
    <circle cx="78" cy="18" r="2" fill="#FF0000" />
    <circle cx="84" cy="16" r="2" fill="#FF0000" />

    {/* Tongue */}
    <path
      d="M85,12 Q87,10 89,8 M85,12 Q87,10 91,9"
      stroke="#FF6B6B"
      strokeWidth="1.5"
      fill="none"
    />

    {/* Body patterns */}
    <ellipse
      cx="25"
      cy="75"
      rx="3"
      ry="2"
      fill="#2E7D32"
      opacity="0.6"
      transform="rotate(-20 25 75)"
    />
    <ellipse
      cx="50"
      cy="55"
      rx="3"
      ry="2"
      fill="#2E7D32"
      opacity="0.6"
      transform="rotate(-15 50 55)"
    />
    <ellipse
      cx="75"
      cy="30"
      rx="3"
      ry="2"
      fill="#2E7D32"
      opacity="0.6"
      transform="rotate(-10 75 30)"
    />
  </svg>
);

export const LadderIcon = ({ className = "", size = 60 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
    }}
  >
    <defs>
      <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8D6E63" />
        <stop offset="30%" stopColor="#A1887F" />
        <stop offset="70%" stopColor="#8D6E63" />
        <stop offset="100%" stopColor="#6D4C41" />
      </linearGradient>
      <linearGradient id="rungGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#A1887F" />
        <stop offset="50%" stopColor="#BCAAA4" />
        <stop offset="100%" stopColor="#8D6E63" />
      </linearGradient>
    </defs>

    {/* Left rail */}
    <rect
      x="25"
      y="10"
      width="8"
      height="80"
      fill="url(#woodGradient)"
      rx="4"
    />

    {/* Right rail */}
    <rect
      x="67"
      y="10"
      width="8"
      height="80"
      fill="url(#woodGradient)"
      rx="4"
    />

    {/* Rungs */}
    <rect
      x="25"
      y="20"
      width="50"
      height="5"
      fill="url(#rungGradient)"
      rx="2"
    />
    <rect
      x="25"
      y="32"
      width="50"
      height="5"
      fill="url(#rungGradient)"
      rx="2"
    />
    <rect
      x="25"
      y="44"
      width="50"
      height="5"
      fill="url(#rungGradient)"
      rx="2"
    />
    <rect
      x="25"
      y="56"
      width="50"
      height="5"
      fill="url(#rungGradient)"
      rx="2"
    />
    <rect
      x="25"
      y="68"
      width="50"
      height="5"
      fill="url(#rungGradient)"
      rx="2"
    />
    <rect
      x="25"
      y="80"
      width="50"
      height="5"
      fill="url(#rungGradient)"
      rx="2"
    />

    {/* Wood grain details */}
    <line
      x1="27"
      y1="12"
      x2="27"
      y2="88"
      stroke="#6D4C41"
      strokeWidth="1"
      opacity="0.5"
    />
    <line
      x1="31"
      y1="12"
      x2="31"
      y2="88"
      stroke="#6D4C41"
      strokeWidth="1"
      opacity="0.5"
    />
    <line
      x1="69"
      y1="12"
      x2="69"
      y2="88"
      stroke="#6D4C41"
      strokeWidth="1"
      opacity="0.5"
    />
    <line
      x1="73"
      y1="12"
      x2="73"
      y2="88"
      stroke="#6D4C41"
      strokeWidth="1"
      opacity="0.5"
    />

    {/* Metallic bolts */}
    <circle
      cx="29"
      cy="22"
      r="1.5"
      fill="#C0C0C0"
      stroke="#808080"
      strokeWidth="0.5"
    />
    <circle
      cx="71"
      cy="22"
      r="1.5"
      fill="#C0C0C0"
      stroke="#808080"
      strokeWidth="0.5"
    />
    <circle
      cx="29"
      cy="46"
      r="1.5"
      fill="#C0C0C0"
      stroke="#808080"
      strokeWidth="0.5"
    />
    <circle
      cx="71"
      cy="46"
      r="1.5"
      fill="#C0C0C0"
      stroke="#808080"
      strokeWidth="0.5"
    />
    <circle
      cx="29"
      cy="70"
      r="1.5"
      fill="#C0C0C0"
      stroke="#808080"
      strokeWidth="0.5"
    />
    <circle
      cx="71"
      cy="70"
      r="1.5"
      fill="#C0C0C0"
      stroke="#808080"
      strokeWidth="0.5"
    />
  </svg>
);
