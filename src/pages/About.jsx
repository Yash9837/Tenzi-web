import Button from "../components/Button.jsx";

const processSteps = [
  {
    title: "Fabric Sourcing",
    description: "Premium denim, twills, and micro-textured fabrics sourced from trusted mills."
  },
  {
    title: "Precision Cutting",
    description: "Automated cutting with strict measurement checks for consistent size runs."
  },
  {
    title: "Stitching & Assembly",
    description: "Reinforced seams, bartacks, and premium trims to handle high retail turnover."
  },
  {
    title: "Quality Control",
    description: "Multi-point inspection across fit, wash, and packaging for retail-ready delivery."
  }
];

const capabilityStats = [
  { label: "Monthly Output", value: "25K+" },
  { label: "Fabric Variations", value: "40+" },
  { label: "Retail Partners", value: "300+" },
  { label: "On-time Delivery", value: "98%" }
];

export default function About() {
  return (
    <div className="space-y-16">
      <section className="section">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">Brand Story</p>
            <h1 className="section-title">Leading manufacturer & wholesaler of men&apos;s bottoms.</h1>
            <p className="mt-4 text-muted">
              TENZI is a distinguished name in men&apos;s bottom-wear manufacturing and wholesale. We are dedicated to
              crafting premium jeans, pants, and trousers that combine contemporary style with unparalleled comfort
              for the modern man, delivering value and consistency to our B2B partners.
            </p>
            <p className="mt-6 text-muted">
              Every garment features our signature TENZI leather-style back patch and precision branding to ensure an
              authentic retail experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/wholesale">Request Production Specs</Button>
              <Button to="/collections" variant="outline">
                View Collections
              </Button>
            </div>
          </div>
          <div className="glass-card overflow-hidden p-6">
            <img
              src="/images/models-hero.png"
              alt="TENZI production"
              className="h-72 w-full rounded-3xl object-cover"
            />
            <div className="mt-6 grid grid-cols-2 gap-4">
              {capabilityStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border p-4 text-center">
                  <p className="font-display text-2xl text-primary">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Production Process</p>
          <h2 className="section-title">Craftsmanship you can trust.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {processSteps.map((step, index) => (
              <div key={step.title} className="glass-card p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-charcoal">Step {index + 1}</p>
                <h3 className="mt-2 font-display text-xl">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl rounded-3xl border border-primary bg-background p-10 shadow-soft">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="eyebrow">B2B Focus</p>
              <h2 className="section-title">Wholesale operations designed for growth.</h2>
              <p className="mt-3 text-sm text-muted">
                Dedicated account managers, controlled pricing, and rigorous QC ensure every shipment protects your
                retail reputation.
              </p>
            </div>
            <Button to="/wholesale">Become a Partner</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
