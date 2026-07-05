// Official wallet brand SVGs - carefully traced from official brand assets

export const MetaMaskIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
    {/* Fox head base */}
    <path d="M20 2L10 10.5l2 12L20 38l8-15.5 2-12L20 2z" fill="#E17726"/>
    {/* Left ear */}
    <path d="M20 2L10 10.5h6.5L20 8l3.5 2.5H30L20 2z" fill="#E27625"/>
    {/* Left face */}
    <path d="M10 10.5l2 12 6-4.5h-4l-4-7.5z" fill="#E27625"/>
    {/* Right face */}
    <path d="M30 10.5l-2 12-6-4.5h4l4-7.5z" fill="#E27625"/>
    {/* Lower left */}
    <path d="M12 22.5l8 15.5-2-10-6-5.5z" fill="#E27625"/>
    {/* Lower right */}
    <path d="M28 22.5l-8 15.5 2-10 6-5.5z" fill="#E27625"/>
    {/* Brow */}
    <path d="M16.5 18h7l-3.5-3-3.5 3z" fill="#D5BFB2"/>
    {/* Nose bridge */}
    <path d="M20 15l-3.5 3h7L20 15z" fill="#233447"/>
    {/* Left cheek */}
    <path d="M10 10.5l6.5-2-4 7.5-2.5-5.5z" fill="#CC6228"/>
    {/* Right cheek */}
    <path d="M30 10.5l-6.5-2 4 7.5 2.5-5.5z" fill="#CC6228"/>
    {/* Left jaw */}
    <path d="M12 22.5l-2-12 4 7.5-2 4.5z" fill="#E27525"/>
    {/* Right jaw */}
    <path d="M28 22.5l2-12-4 7.5 2 4.5z" fill="#E27525"/>
    {/* Left snout */}
    <path d="M16.5 18l-2 4.5-4-4.5h6z" fill="#F5841F"/>
    {/* Right snout */}
    <path d="M23.5 18l2 4.5 4-4.5h-6z" fill="#F5841F"/>
    {/* Left chin */}
    <path d="M14.5 22.5l5.5 13.5-4-10-1.5-3.5z" fill="#C0AC9D"/>
    {/* Right chin */}
    <path d="M25.5 22.5l-5.5 13.5 4-10 1.5-3.5z" fill="#C0AC9D"/>
    {/* Mouth */}
    <path d="M16.5 18h7l-1 6.5h-5l-1-6.5z" fill="#161616"/>
    {/* Tongue/detail */}
    <path d="M18 24.5h4l-.5 4-1.5 1-1.5-1-.5-4z" fill="#763E1A"/>
  </svg>
);

export const TrustWalletIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
    <defs>
      <linearGradient id="twg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0500FF"/>
        <stop offset="0.5" stopColor="#00B8FF"/>
        <stop offset="1" stopColor="#00FFC2"/>
      </linearGradient>
    </defs>
    {/* Shield */}
    <path d="M20 2L4 9v16c0 10.5 7 19.5 16 22.5 9-3 16-12 16-22.5V9L20 2z" fill="url(#twg)"/>
    {/* Inner T shape */}
    <path d="M14 12h12v3h-4.5v10c0 1.5-1.5 3-3 3s-3-1.5-3-3V15H14v-3z" fill="white" opacity="0.9"/>
    <circle cx="20" cy="28" r="2" fill="white" opacity="0.9"/>
  </svg>
);

export const BinanceWalletIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
    <rect width="40" height="40" rx="10" fill="#1E1E1E"/>
    {/* BNB Diamond logo */}
    <path d="M20 6l3.5 3.5L20 13l-3.5-3.5L20 6zM28 14l3.5 3.5L28 21l-3.5-3.5L28 14zM20 22l3.5 3.5L20 29l-3.5-3.5L20 22zM12 14l3.5 3.5L12 21l-3.5-3.5L12 14z" fill="#F0B90B"/>
    <circle cx="20" cy="17.5" r="2.5" fill="#F0B90B"/>
  </svg>
);

export const WalletConnectIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
    <circle cx="20" cy="20" r="18" fill="#3B99FC"/>
    <path
      d="M12.5 15.5c5.2-5 13.8-5 19 0l.6.6c.2.2.2.6 0 .8l-2.2 2.2c-.1.1-.3.1-.4 0l-.9-.9c-3.6-3.4-9.4-3.4-13 0l-.9.9c-.1.1-.3.1-.4 0l-2.2-2.2c-.2-.2-.2-.6 0-.8l.6-.6zM28.3 19.4l2 1.9c.2.2.2.5 0 .7l-8.9 8.6c-.2.2-.5.2-.7 0l-6.3-6.1c-.1-.1-.1-.3 0-.4l2-1.9c.1-.1.3-.1.4 0l4 3.9c.2.2.5.2.7 0l7.1-6.9c.1-.1.3-.1.4 0l-.2.1z"
      fill="#fff"
    />
  </svg>
);
