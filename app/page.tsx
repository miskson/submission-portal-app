"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [levels, setLevels] = useState({ notFound: true });
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
    Validation: ""
  })

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
  }

  async function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("form submit");
    e.preventDefault();
    try {
      const res = await fetch("https://tools.qa.public.ale.ai/api/tools/candidates/assignments", {
        method: "POST",
        body: JSON.stringify(formState),
        headers: {
          "content-type": "application/json",
        }
      })
      const data = await res.json()
      if (data.status === 'error') {
        data.errors.push(data.message)
        updateFormFieldErrors(data.errors)
      } else if (data.status === 'success') {
        alert('TATS A SUCC')
      }
      console.log(data)
    } catch (err) {
      console.error("An error occured while submitting the form:", err);
    }
  }

  function updateFormField(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("updating");
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function updateFormFieldErrors(errorsArr: string[]) {
    errorsArr.forEach((error) => {
      const currentErr = error.split(' ')[0]
      setFormErrors((prevState) => ({
        ...prevState,
        [currentErr]: error
      }))
    })
  }


  useEffect(() => {
    getLevels();
  }, []);

  useEffect(() => {
    console.log(formState);
  }, [formState, setFormState]);

  return (
    <div>
      <main>
        <h1>Submission portal</h1>
        <form onSubmit={(e) => formSubmit(e)}>
          <div>
            <label htmlFor="name-input">Name</label>
            <input
              className="border block"
              required
              type="text"
              name="name"
              value={formState.name}
              onChange={(e) => updateFormField(e)}
            />
            <small className="text-red-600">{formErrors.Name}</small>
          </div>
          <div className="border-t-2 border-t-slate-200">
            <label htmlFor="email-input">Email</label>
            <input
              className="border block"
              required
              type="email"
              name="email"
              value={formState.email}
              onChange={(e) => updateFormField(e)}
            />
            <small className="text-red-600">{formErrors.Email}</small>
          </div>
          <div className="border-t-2 border-t-slate-200">
            <label htmlFor="assignment_description">Assignment Description:</label>
            <textarea
              className="border block"
              required
              name="assignment_description"
              value={formState.assignment_description}
              onChange={(e) => updateFormField(e)}
            />
            <small className="text-red-600">{formErrors.Assignment}</small>
          </div>
          <div className="border-t-2 border-t-slate-200">
            <label htmlFor="github_repo_url">GitHub Repository URL</label>
            <input
              className="border block"
              required
              type="url"
              name="github_repo_url"
              value={formState.github_repo_url}
              onChange={(e) => updateFormField(e)}
            />
            <small className="text-red-600">{formErrors.GitHub}</small>
          </div>
          <div className="border-t-2 border-t-slate-200 mb-8">
            <select
              name="candidate_level"
              id="lvl-select"
              required
              value={formState.candidate_level}
              onChange={(e) => updateFormField(e)}
            >
              {!levels.notFound &&
                levels?.levels.map((name: string) => (
                  <option key={name}>{name}</option>
                ))}
            </select>
            <small className="text-red-600">
              {levels.notFound && "Error fetching data"}
            </small>
          </div>
          <button className="border border- block bg-emerald-400 p-4">
            Submit
          </button>
          <strong className="block mt-3 text-red-600">{formErrors.Validation}</strong>
        </form>
      </main>
    </div>
  );
}
