"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./_components/Loading/loading";

type LevelsState = { notFound: boolean } | { levels: string[] };

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState<LevelsState>({ notFound: true });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    assignment_description: "",
    github_repo_url: "",
    candidate_level: "Junior",
  });

  const [formErrors, setFormErrors] = useState({
    Name: "",
    Email: "",
    Assignment: "",
    GitHub: "",
    Validation: "",
  });

  async function getLevels() {
    try {
      const res = await fetch(
        "https://tools.qa.public.ale.ai/api/tools/candidates/levels"
      );
      const data = await res.json();
      setLevels(data);
    } catch (err) {
      console.error("An error occured while fetching candidate levels:", err);
      setLevels({ notFound: true });
    }
    setIsLoading(false);
  }

  async function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(
        "https://tools.qa.public.ale.ai/api/tools/candidates/assignments",
        {
          method: "POST",
          body: JSON.stringify(formState),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.status === "error") {
        data.errors.push(data.message);
        updateFormFieldErrors(data.errors);
        setIsLoading(false);
      }
      if (data.status === "success") {
        router.push("/thank-you");
      }
    } catch (err) {
      console.error("An error occured while submitting the form:", err);
    }
  }

  function updateFormField(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function updateFormFieldErrors(errorsArr: string[]) {
    errorsArr.forEach((error) => {
      const currentErr = error.split(" ")[0];
      setFormErrors((prevState) => ({
        ...prevState,
        [currentErr]: error,
      }));
    });
  }

  useEffect(() => {
    getLevels();
  }, []);

  const isLevelsAvailable = (
    levels: LevelsState
  ): levels is { levels: string[] } => "levels" in levels;

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <main className="app-container">
          <form
            className="app-container-vertical"
            onSubmit={(e) => formSubmit(e)}
          >
            <div className="border-l-2 border-l-black border-dotted p-2">
              <img className="w-48" src="/next.svg" alt="logo" />
              <h1 className="app-heading">Submission portal</h1>
            </div>
            <div className="app-form-field">
              <label className="app-label" htmlFor="name-input">
                Name:
              </label>
              <input
                className="app-input-field"
                required
                type="text"
                id="name-input"
                name="name"
                value={formState.name}
                onChange={(e) => updateFormField(e)}
              />
              <small className="block text-red-600">{formErrors.Name}</small>
            </div>
            <div className="app-form-field">
              <label className="app-label" htmlFor="email-input">
                Email:
              </label>
              <input
                className="app-input-field"
                required
                id="email-input"
                type="email"
                name="email"
                value={formState.email}
                onChange={(e) => updateFormField(e)}
              />
              <small className="block text-red-600">{formErrors.Email}</small>
            </div>
            <div className="app-form-field">
              <label
                className="app-label"
                htmlFor="assignment_description-input"
              >
                Assignment Description:
              </label>
              <textarea
                className="border rounded-md block w-full h-36 px-2 pt-2"
                required
                id="assignment_description-input"
                name="assignment_description"
                value={formState.assignment_description}
                onChange={(e) => updateFormField(e)}
              />
              <small className="block text-red-600">
                {formErrors.Assignment}
              </small>
            </div>
            <div className="app-form-field">
              <label className="app-label" htmlFor="github_repo_url-input">
                GitHub Repository URL:
              </label>
              <input
                className="app-input-field"
                required
                type="url"
                id="github_repo_url-input"
                name="github_repo_url"
                value={formState.github_repo_url}
                onChange={(e) => updateFormField(e)}
              />
              <small className="block text-red-600">{formErrors.GitHub}</small>
            </div>
            <div className="app-select-container">
              <div>
                <label className="app-label" htmlFor="lvl-select">
                  Candidate Level
                </label>
                <select
                  className="app-select"
                  name="candidate_level"
                  id="lvl-select"
                  required
                  value={formState.candidate_level}
                  onChange={(e) => updateFormField(e)}
                >
                  {isLevelsAvailable(levels) &&
                    levels.levels.map((name: string) => (
                      <option key={name}>{name}</option>
                    ))}
                </select>
                <small className="block text-red-600">
                  {!isLevelsAvailable(levels) &&
                    "Error fetching data. try reloading the page."}
                </small>
              </div>
            </div>
            <div className="w-56 flex justify-center pb-6 border-l-2 border-b-black border-l-black border-dotted">
              <button className="app-button">Submit</button>
            </div>
            <strong className="block mt-3 text-red-600">
              {formErrors.Validation}
            </strong>
          </form>
        </main>
      )}
    </div>
  );
}
