import Link from "next/link";
import Header from "@/components/layout/header";
import LetterGlitch from "@/components/animations/letter-glitch";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/footer";
import InfoSection from "@/components/home/info-section";
import DescSection from "@/components/home/desc-section";
import { Divider } from "@/components/ui/divider";

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-ds-background-200 text-ds-gray-1000 flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="relative">
          {/* Blur blobs */}
          <div className="absolute top-0 left-0 h-[calc(100%+4rem)] w-full md:h-[calc(100%+8rem)]">
            <LetterGlitch
              glitchColors={[
                "oklch(20.5% 0 0)",
                "oklch(37.1% 0 0)",
                "oklch(26.9% 0 0)",
              ]}
              glitchSpeed={50}
              centerVignette={true}
              outerVignette={false}
              smooth={true}
            />
            <div className="from-ds-background-200 via-ds-background-200/80 pointer-events-none absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t to-transparent" />
          </div>
          <div className="absolute top-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/20 opacity-50 blur-[120px]" />
          <div className="absolute top-32 left-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-500/20 opacity-40 blur-[100px]" />
          <div className="absolute top-24 left-2/3 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/15 opacity-50 blur-[110px]" />

          <div className="arc-wrapper">
            <div className="border-ds-gray-alpha-400 relative flex w-full flex-col items-center gap-8 border-x px-2 pt-20 pb-36 text-center backdrop-blur-xs sm:px-0 sm:pt-32">
              <div className="flex flex-col items-center gap-4">
                <Link
                  href="/dashboard"
                  className="group border-ds-gray-alpha-400 bg-ds-gray-alpha-200 relative mx-auto mb-4 flex items-center justify-center rounded-full border px-3 py-1 backdrop-blur-sm sm:px-4 sm:py-1.5"
                >
                  <span className="text-base sm:text-lg">💰</span>
                  <hr className="bg-ds-gray-600 mx-1.5 h-3 w-px shrink-0 sm:mx-2 sm:h-4" />
                  <span className="text-xs font-medium whitespace-nowrap sm:text-sm">
                    Built for HackDecouverte
                  </span>
                  <ArrowRight className="stroke-ds-gray-600 ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 sm:size-4" />
                </Link>

                <h1 className="flex flex-col font-serif text-4xl leading-[1.1] font-medium tracking-tighter md:text-7xl">
                  <span>
                    <span className="text-ds-gray-1000">Smart Budget</span>
                  </span>
                  <span className="text-ds-gray-900">
                    <span className="text-ds-gray-1000">for Students</span>
                  </span>
                </h1>
                <p className="text-ds-gray-900 mx-auto mt-2 max-w-3xl text-xl tracking-tighter md:text-2xl">
                  Track expenses, simulate financial scenarios with AI,
                  <br />
                  and gain insights to manage your student budget better
                </p>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="group bg-ds-gray-1000 text-ds-background-100 hover:bg-ds-gray-900 flex items-center gap-0 rounded-full py-6 !pr-6 !pl-6"
                  asChild
                >
                  <Link href="/dashboard">
                    <span>Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="arc-wrapper">
          <Divider
            variant="diagonal"
            className="bg-ds-background-200 border-ds-gray-alpha-400 text-ds-gray-alpha-400 h-8 border"
          />
        </div>

        <div className="arc-wrapper">
          <DescSection />
        </div>

        <div className="arc-wrapper">
          <Divider
            variant="diagonal"
            className="bg-ds-background-200 border-ds-gray-alpha-400 text-ds-gray-alpha-400 h-8 border"
          />
        </div>

        <div className="arc-wrapper">
          <InfoSection />
        </div>

        {/* <div className="arc-wrapper w-full">
          <Divider
            variant="diagonal"
            className="border-ds-gray-alpha-400 text-ds-gray-alpha-400 h-8 border backdrop-blur-sm"
          />
        </div> */}
        {/* <div className="arc-wrapper">
          <Divider
            variant="fill"
            className="border-ds-gray-alpha-400 text-ds-background-200 h-8 border"
          />
        </div> */}

        {/* <div className="arc-wrapper">
          <PricingSection />
        </div> */}

        {/* Video PoC Section */}
        {/* <PocSection /> */}

        {/* <div className="arc-wrapper w-full">
          <Divider
            variant="fill"
            className="border-ds-gray-alpha-400 text-ds-background-200 h-8 border"
            style={{
              borderBottom: "1px dashed var(--ds-gray-alpha-400)",
            }}
          />
        </div> */}

        {/* Desc Section */}
        {/* <DescSection /> */}

        {/* <div className="arc-wrapper w-full">
          <div className="border-ds-gray-alpha-400 w-full border-b "></div>
        </div> */}
        {/* <div className="arc-wrapper w-full">
          <Divider
            variant="fill"
            className="border-ds-gray-alpha-400 text-ds-background-200 h-4 border"
            style={{
              borderLeft: "1px dashed var(--ds-gray-alpha-400)",
              borderRight: "1px dashed var(--ds-gray-alpha-400)",
            }}
          />
        </div> */}

        {/* Products Section */}
        {/* <ProductsSection /> */}

        {/* <div className="arc-wrapper w-full">
          <div className="border-ds-gray-alpha-400 w-full border-b"></div>
        </div> */}
        {/* <div className="arc-wrapper w-full">
          <Divider
            variant="fill"
            className="border-ds-gray-alpha-400 text-ds-background-200 h-4 border"
            style={{
              borderLeft: "1px dashed var(--ds-gray-alpha-400)",
              borderRight: "1px dashed var(--ds-gray-alpha-400)",
            }}
          />
        </div> */}

        {/* CTA Section */}

        {/* <RoadmapSection /> */}

        {/* <div className="arc-wrapper w-full">
          <Divider
            variant="diagonal"
            className="border-ds-gray-alpha-400 text-ds-background-200 h-8 border"
          />
        </div> */}

        {/* Blog Section */}
        {/* <BlogSection /> */}

        {/* <div className="arc-wrapper w-full">
          <Divider
            variant="fill"
            className="border-ds-gray-alpha-400 text-ds-background-200 h-4 border"
          />
        </div> */}

        {/* CTA Section */}
        {/* <CtaSection /> */}
        {/* <div className="arc-wrapper w-full">
          <Divider
            variant="diagonal"
            className="border-ds-gray-alpha-400 text-ds-gray-alpha-400 h-8 border"
          />
        </div> */}

        {/* Waitlist Section */}
        {/* <WaitlistSection /> */}

        <Footer />
      </main>
    </>
  );
}
