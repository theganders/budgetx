
import { PixelatedCanvas } from "../animations/pixelated-canvas";

export default function DescSection() {
  return (
    <section className="relative w-full">
        <div className="border-ds-gray-alpha-400 relative grid grid-cols-3 border-x">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="border-ds-gray-alpha-400 absolute top-0 h-full border-l border-dashed"
              style={{ left: "calc(33.333% - 0.5px)" }}
            ></div>
            <div
              className="border-ds-gray-alpha-400 absolute top-0 h-full border-l border-dashed"
              style={{ left: "calc(66.667% - 0.5px)" }}
            ></div>
          </div>

          <div className="z-10 flex flex-col justify-center px-8 py-16 sm:py-24">
            <div className="flex flex-col items-center gap-1">
              <span className="text-ds-gray-1000 font-mono text-2xl font-semibold tracking-tighter md:text-3xl">
                Smart
              </span>
              <span className="text-ds-gray-900 text-xs tracking-tight md:text-sm">
                Budget Tracking
              </span>
            </div>
          </div>
          <div className="z-10 flex items-center justify-center py-10 relative">
            <div className="absolute inset-0 flex items-center justify-center w-full h-full">
              <PixelatedCanvas
                src="/coin.svg"
                width={850 / 4}
                height={850 / 4}
                cellSize={4}
                dotScale={0.9}
                shape="square"
                backgroundColor="#000000"
                dropoutStrength={0.1}
                interactive
                distortionStrength={0.1}
                distortionRadius={150}
                distortionMode="repel"
                followSpeed={0.2}
                jitterStrength={4}
                jitterSpeed={1}
                sampleAverage
              />
            </div>
          </div>
          <div className="z-10 flex flex-col justify-center px-8 py-16 sm:py-24">
            <div className="flex flex-col items-center gap-1">
              <span className="text-ds-gray-1000 font-mono text-2xl font-semibold tracking-tighter md:text-3xl">
                AI-Powered
              </span>
              <span className="text-ds-gray-900 text-xs tracking-tight md:text-sm">
                Financial Insights
              </span>
            </div>
          </div>

          {/* <div className="z-10 flex flex-col items-center justify-center gap-4 px-8 py-16 sm:py-24">
            <div className="flex flex-col items-start justify-between gap-9 px-8">
              <p className="text-ds-gray-900 w-full text-left">
                Get started using pwno to empower and accelerate your security
                research.
              </p>
              <Button
                asChild
                className="bg-ds-gray-1000 text-ds-background-100 hover:bg-ds-gray-900 rounded-full py-4 font-medium transition-colors"
              >
                <Link href="/auth/login" className="px-8">
                  Get Started with Pwno
                  <Sparkles className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div> */}
        </div>

    </section>
  );
}
