import Link from "next/link";

export default async function ThankYouPage() {
  return (
    <div className="app-container border screen-height">
      <div className="app-container-vertical ">
        <h1 className="app-heading">
          Thank you for submitting your assignment!
        </h1>
        <Link href={"/"} className="block w-fit my-0 mx-auto">
          <button className="app-button">{"< "}BACK</button>
        </Link>
      </div>
    </div>
  );
}
