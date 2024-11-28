interface ILevels {
  levels?: string[],
  notFound?: boolean
}

async function getLevels(): Promise<ILevels> {
  try {
    const res = await fetch('https://tools.qa.public.ale.ai/api/tools/candidates/levels')
    const data = await res.json()
    return data
  } catch (err) {
    console.warn('THE ERROR OCCURED:', err)
    return {
      notFound: true
    }
  }
}

export default async function Home() {
  const levels = await getLevels()
  return (
    <div>
      <main>
        <h1>Submission portal</h1>
        <form>
          <div>
            <label htmlFor="name-input">Name</label>
            <input className="border block" required type="text" name="name-input" />
            <small className="text-red-600">err text</small>
          </div>
          <div className="border-t-2 border-t-slate-200">
            <label htmlFor="email-input">Email</label>
            <input className="border block" required type="email" name="email-input" />
            <small className="text-red-600">err text</small>
          </div>
          <div className="border-t-2 border-t-slate-200">
            <label htmlFor="description-input">Assignment Description:</label>
            <textarea className="border block" required name="description-input" />
            <small className="text-red-600">err text</small>
          </div>
          <div className="border-t-2 border-t-slate-200">
            <label htmlFor="repo-input">GitHub Repository URL</label>
            <input className="border block" required type="url" name="repo-input" />
            <small className="text-red-600">err text</small>
          </div>
          <div className="border-t-2 border-t-slate-200 mb-8">
            <select name="levels-select" id="lvl-select" required> 
              {!levels.notFound && levels.levels?.map((name) =>
                <option key={name}>{name}</option>
              )}
            </select>
            <small className="text-red-600">{levels.notFound && 'Error fetching data'}</small>
          </div>
          <button className="border border- block bg-emerald-400 p-4">Submit</button>
          <strong className="block mt-3 text-red-600">err text</strong>
        </form>
      </main>
    </div>
  );
}
