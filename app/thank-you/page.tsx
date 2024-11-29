import Link from "next/link";

export default async function ThankYouPage() {
  return (
    <div>
      <h1>Thank you for submitting your assignment!</h1>
      <Link href={"/"} className="block w-fit">
        <button className="app-button place-content-center">{"< "}BACK</button>
      </Link>
    </div>
  );
}
