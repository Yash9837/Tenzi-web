import Button from "../components/Button.jsx";

export default function NotFound() {
  return (
    <section className="section">
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="section-title">We couldn&apos;t find that page.</h1>
        <p className="mt-4 text-muted">Let&apos;s get you back to the TENZI wholesale experience.</p>
        <div className="mt-8 flex justify-center">
          <Button to="/">Return Home</Button>
        </div>
      </div>
    </section>
  );
}
