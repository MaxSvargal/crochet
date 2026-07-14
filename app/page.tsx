import Hero from "@/components/hero"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero stripePublishableKey={process.env.STRIPE_PUBLISHABLE_KEY ?? ""} />
    </main>
  )
}
