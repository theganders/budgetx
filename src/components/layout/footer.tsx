import Link from "next/link";
import { FlickeringGridText } from "../animations/flickering-grid-text";

const footerLinks = [
  {
    title: "Product",
    links: [
      {
        title: "Dashboard",
        href: "/dashboard",
      },
      {
        title: "Features",
        href: "#features",
      },
      {
        title: "Get Started",
        href: "/dashboard",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        title: "How It Works",
        href: "#how-it-works",
      },
      {
        title: "Student Tips",
        href: "#tips",
      },
      {
        title: "Support",
        href: "mailto:support@budgetx.app",
      },
    ],
  },
  {
    title: "About",
    links: [
      {
        title: "HackDecouverte",
        href: "#",
        external: true,
      },
      {
        title: "Privacy Policy",
        href: "#",
      },
      {
        title: "Terms of Service",
        href: "#",
      },
    ],
  },
];

export default function HomeFooter() {
  return (
    <>

      {/* Main Footer */}
      <footer className="relative w-full">
        <div className="arc-wrapper">
          <div className="border-ds-gray-alpha-400 bg-ds-background-200 border-x border-b-0 border-t">
            <div className="px-8 py-12 md:px-16 md:py-16">
              <div className="grid gap-12 md:grid-cols-5">
                {/* Brand Column */}
                <div className="md:col-span-2">
                  <div className="mb-6">
                    <h3 className="font-serif text-2xl font-medium tracking-tighter">
                      <span className="italic">BudgetX</span>
                    </h3>
                    <p className="text-ds-gray-900 mt-2 max-w-md text-sm leading-tight">
                      Smart budget management for students. Track expenses, simulate scenarios with AI, and take control of your finances.
                    </p>
                  </div>
                  <div className="mt-6">
                    <p className="text-ds-gray-900 text-sm">Built for HackDecouverte 2025</p>
                    <p className="text-ds-gray-800 mt-1 text-xs">
                      Made with 💚 for students everywhere
                    </p>
                  </div>
                </div>

                {/* Links Columns */}
                <div className="md:col-span-3 grid grid-cols-2 gap-8 sm:grid-cols-3">
                  {footerLinks.map((section) => (
                    <div key={section.title}>
                      <h4 className="text-ds-gray-1000 mb-4 font-semibold text-sm">
                        {section.title}
                      </h4>
                      <div className="flex flex-col gap-2 text-sm text-ds-gray-900">
                        {section.links.map((link) => (
                          link.external ? (
                            <a 
                              key={`${link.href}-${link.title}`} 
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-ds-gray-1000 transition-colors"
                            >
                              {link.title}
                            </a>
                          ) : (
                            <Link 
                              key={`${link.href}-${link.title}`} 
                              href={link.href} 
                              className="hover:text-ds-gray-1000 transition-colors"
                            >
                              {link.title}
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-ds-gray-900 relative flex w-full flex-col items-center justify-center">
              <div className="from-ds-background-200 pointer-events-none absolute top-0 right-0 left-0 z-10 h-16 bg-gradient-to-b to-transparent" />
              <FlickeringGridText
                className="inset-0 z-0 size-full h-64 w-full"
                squareSize={2}
                gridGap={3}
                color="#708A58"
                maxOpacity={0.5}
                flickerChance={0.1}
                text="BudgetX"
                mobileText="BudgetX"
                mobileBreakpoint={1024}
                fontSize={180}
                textBrightness={0.7}
                textOffsetY={28}
                fontWeight={500}
              />
            </div>
        
          </div>
        </div>
      </footer>
    </>
  );
}
