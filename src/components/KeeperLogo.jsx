const KeeperLogo = ({ size = 40 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Sticky note */}
    <rect x="4" y="4" width="56" height="56" rx="10" fill="#fffde7" stroke="#fbc02d" strokeWidth="2"/>
    {/* Pencil icon */}
    <path d="M40 20L44 24L24 44H20V40L40 20Z" fill="#fbc02d"/>
  </svg>
);

export default KeeperLogo;
