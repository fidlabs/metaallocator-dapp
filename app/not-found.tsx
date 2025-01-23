import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="container mx-auto flex flex-col min-h-screen justify-center items-center gap-4">
      <h1 className="text-8xl">404</h1>
      <p className="text-muted-foreground">
        The page you are requesting could not be found.
      </p>
      <Link href="/" className="underline text-dodger-blue">
        Go to Home Page
      </Link>
    </div>
  );
}
