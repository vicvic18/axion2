import { Link } from "react-router";

const footerLinks = [
  {
    title: "Chain",
    links: [
      { label: "BNB Smart Chain", href: "https://www.bnbchain.org/en/bnb-smart-chain" },
      { label: "BNB Greenfield", href: "https://www.bnbchain.org/en/greenfield" },
      { label: "opBNB", href: "https://www.bnbchain.org/en/opbnb" },
    ],
  },
  {
    title: "Use Axion",
    links: [
      { label: "Download Wallet", href: "https://trustwallet.com/download" },
      { label: "Get BNB", href: "https://www.binance.com/en/how-to-buy/bnb" },
      { label: "Stake BNB", href: "https://www.bnbchain.org/en/bnb-staking" },
      { label: "Bridge Assets", href: "https://www.bnbchain.org/en/bridge" },
    ],
  },
  {
    title: "Build",
    links: [
      { label: "Documentation", href: "https://docs.bnbchain.org/" },
      { label: "Dev Tools", href: "https://www.bnbchain.org/en/dev-tools" },
      { label: "GitHub", href: "https://github.com/axion-stake/axion-protocol" },
    ],
  },
  {
    title: "Participate",
    links: [
      { label: "Governance", href: "/governance" },
      { label: "Bug Bounty", href: "/bug-bounty" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Blog", href: "https://x.com/axionstake" },
      { label: "Brand Guidelines", href: "/about" },
    ],
  },
];

const socialIcons = [
  {
    name: "X",
    href: "https://x.com/axionstake",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/axionstake",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.gg/axionstake",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/axion-stake/axion-protocol",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: "Globe",
    href: "https://axionstake.com",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const isInternal = (href: string) => href.startsWith("/");

  return (
    <footer className="border-t border-axion-border bg-axion-bg-secondary">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Upper section */}
        <div className="flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Axion" className="h-6 w-6 rounded-full object-cover" />
            <span className="text-base font-semibold tracking-tight text-white">AXION STAKE</span>
          </div>
          <div className="flex items-center gap-5">
            {socialIcons.map((icon) => (
              <a
                key={icon.name}
                href={icon.href}
                target={isInternal(icon.href) ? undefined : "_blank"}
                rel={isInternal(icon.href) ? undefined : "noopener noreferrer"}
                className="text-axion-text-tertiary transition-all hover:text-white hover:scale-110"
                aria-label={icon.name}
              >
                {icon.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 pb-8 md:grid-cols-5 md:gap-8 md:pb-12">
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="mb-3 text-[11px] font-medium tracking-wide text-white uppercase md:mb-4 md:text-xs">
                {column.title}
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {isInternal(link.href) ? (
                      <Link
                        to={link.href}
                        className="text-xs text-axion-text-tertiary transition-colors hover:text-white md:text-sm"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-axion-text-tertiary transition-colors hover:text-white md:text-sm"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-axion-border py-4 md:flex-row md:gap-4 md:py-6">
          <p className="text-[11px] text-axion-text-muted md:text-xs">
            &copy; 2026 Axion Stake. All rights reserved.
          </p>
          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/privacy" className="text-[11px] text-axion-text-muted transition-colors hover:text-axion-text-secondary md:text-xs">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[11px] text-axion-text-muted transition-colors hover:text-axion-text-secondary md:text-xs">
              Terms of Service
            </Link>
            <Link to="/disclaimer" className="text-[11px] text-axion-text-muted transition-colors hover:text-axion-text-secondary md:text-xs">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
