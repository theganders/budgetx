import { Wallet, Sparkles, BarChart3 } from "lucide-react";

export default function InfoSection() {
  return (
    <section className="relative w-full">
      <div className="border-ds-gray-alpha-400 border-x">
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
        <div className="relative mx-auto">
          <div className="border-ds-gray-alpha-400 relative py-8">
            {/* Mobile: Stack vertically, Desktop: Grid layout */}
            <div className="flex flex-col gap-4 p-8 md:grid md:grid-cols-4 md:gap-0 md:p-0">
              <h2 className="font-serif text-2xl tracking-tighter md:col-span-3 md:p-8 md:text-3xl">
                <span className="from-ds-gray-1000 to-ds-gray-900 bg-linear-to-r bg-clip-text font-medium text-transparent">
                  Key Features
                </span>
                <br />
                <span className="text-ds-gray-900">
                  AI-powered tools to help you manage your student budget
                </span>
              </h2>
              <div className="md:flex md:items-center md:justify-end md:p-8">
                <p className="text-ds-gray-900 text-sm md:text-right">
                  Track, simulate, and visualize your finances with ease
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-px pb-16 md:grid-cols-3">
          {/* Expense Tracking */}
          <div className="group bg-ds-background-200 hover:bg-ds-background-100 p-8 transition-colors">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20">
                <Wallet className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-ds-gray-1000 font-semibold">Expense Tracking</h3>
                <div className="text-ds-gray-900 text-sm">Manage your money</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="border-ds-gray-alpha-400 bg-ds-gray-alpha-100 border px-3 py-2">
                <div className="text-ds-gray-900 text-sm">
                  Input your income, fixed costs like rent and tuition, and track variable expenses to stay on top of your budget
                </div>
              </div>
            </div>
          </div>

          {/* What-If Simulator */}
          <div className="group bg-ds-background-200 hover:bg-ds-background-100 p-8 transition-colors">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-ds-gray-1000 font-semibold">What-If Simulator</h3>
                <div className="text-ds-gray-900 text-sm">AI-powered scenarios</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="border-ds-gray-alpha-400 bg-ds-gray-alpha-100 border px-3 py-2">
                <div className="text-ds-gray-900 text-sm">
                  Ask AI what happens if you spend more on food, save for a trip, or change your lifestyle—get instant predictions
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Insights */}
          <div className="group bg-ds-background-200 hover:bg-ds-background-100 p-8 transition-colors">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20">
                <BarChart3 className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-ds-gray-1000 font-semibold">Stats & Insights</h3>
                <div className="text-ds-gray-900 text-sm">Visual analytics</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="border-ds-gray-alpha-400 bg-ds-gray-alpha-100 border px-3 py-2">
                <div className="text-ds-gray-900 text-sm">
                  Visual charts showing your spending breakdown, trends over time, and AI-generated predictions for your finances
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
