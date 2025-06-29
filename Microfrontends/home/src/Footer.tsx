import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Shop",
      links: [
        { label: "F1 Cars & Models", href: "#cars" },
        { label: "Team Merchandise", href: "#merchandise" },
        { label: "Racing Gear", href: "#gear" },
        { label: "Collectibles", href: "#collectibles" },
        { label: "Sale Items", href: "#sale" },
      ],
    },
    {
      title: "Teams",
      links: [
        { label: "Mercedes-AMG", href: "#mercedes" },
        { label: "Red Bull Racing", href: "#redbull" },
        { label: "Ferrari", href: "#ferrari" },
        { label: "McLaren", href: "#mclaren" },
        { label: "All Teams", href: "#teams" },
      ],
    },
    {
      title: "Customer Care",
      links: [
        { label: "Track Your Order", href: "#track" },
        { label: "Returns & Exchanges", href: "#returns" },
        { label: "Size Guide", href: "#sizing" },
        { label: "Contact Support", href: "#support" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "About F1Store",
      links: [
        { label: "Our Story", href: "#story" },
        { label: "Authenticity Guarantee", href: "#authentic" },
        { label: "Careers", href: "#careers" },
        { label: "Press", href: "#press" },
        { label: "Partnerships", href: "#partners" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "#instagram",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C8.396 0 7.929.013 6.71.072 5.493.131 4.73.333 4.058.63c-.689.306-1.283.717-1.867 1.301C1.607 2.515 1.196 3.109.89 3.798.593 4.47.391 5.233.332 6.45.273 7.668.26 8.135.26 11.756c0 3.621.013 4.089.072 5.307.059 1.217.261 1.98.558 2.652.306.689.717 1.283 1.301 1.867.584.584 1.178.995 1.867 1.301.672.297 1.435.499 2.652.558 1.218.059 1.686.072 5.307.072 3.621 0 4.089-.013 5.307-.072 1.217-.059 1.98-.261 2.652-.558.689-.306 1.283-.717 1.867-1.301.584-.584.995-1.178 1.301-1.867.297-.672.499-1.435.558-2.652.059-1.218.072-1.686.072-5.307 0-3.621-.013-4.089-.072-5.307-.059-1.217-.261-1.98-.558-2.652-.306-.689-.717-1.283-1.301-1.867C19.498.607 18.904.196 18.215-.11 17.543-.407 16.78-.609 15.563-.668 14.345-.727 13.877-.74 10.256-.74L12.017 0zm0 2.162c3.538 0 3.96.014 5.36.072 1.294.059 1.996.274 2.462.456.619.24 1.061.528 1.525.992.464.464.752.906.992 1.525.182.466.397 1.168.456 2.462.058 1.4.072 1.822.072 5.36 0 3.538-.014 3.96-.072 5.36-.059 1.294-.274 1.996-.456 2.462-.24.619-.528 1.061-.992 1.525-.464.464-.906.752-1.525.992-.466.182-1.168.397-2.462.456-1.4.058-1.822.072-5.36.072-3.538 0-3.96-.014-5.36-.072-1.294-.059-1.996-.274-2.462-.456-.619-.24-1.061-.528-1.525-.992-.464-.464-.752-.906-.992-1.525-.182-.466-.397-1.168-.456-2.462C2.176 15.977 2.162 15.555 2.162 12.017c0-3.538.014-3.96.072-5.36.059-1.294.274-1.996.456-2.462.24-.619.528-1.061.992-1.525.464-.464.906-.752 1.525-.992.466-.182 1.168-.397 2.462-.456 1.4-.058 1.822-.072 5.36-.072z" />
          <path d="M12.017 5.838a6.179 6.179 0 1 0 0 12.358 6.179 6.179 0 0 0 0-12.358zM12.017 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "#twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "#facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "#tiktok",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-black text-white border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-white rounded-full mr-3 flex items-center justify-center">
                    <span className="bg-white font-bold text-sm">🏎️</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    F1<span className="text-red-600">Store</span>
                  </h2>
                </div>
                <p className="mt-2 text-gray-400 text-sm">
                  Your ultimate destination for authentic Formula 1 merchandise,
                  collectibles, and racing gear.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title} className="lg:col-span-1">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">🏎️</span>
                Race Updates & Exclusive Offers
              </h3>
              <p className="text-gray-400 text-sm">
                Be the first to know about new products, race results, and
                special promotions.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-900 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-r-md transition-colors duration-200 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-400">
                © {currentYear} F1Store. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#privacy"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="#terms"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Terms & Conditions
                </a>
                <a
                  href="#shipping"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Shipping Info
                </a>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-sm text-gray-400 mr-2">
                Secure payments
              </span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-xs text-white flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-xs text-white flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-yellow-500 rounded text-xs text-black flex items-center justify-center font-bold">
                  PP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
