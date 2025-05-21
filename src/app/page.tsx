export default function Home() {
  return (
    <>
      <main className="p-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Application Tracker
        </h1>
        <p className="mb-4">
          This is a <strong>pet project</strong> designed to help developers and
          IT specialists track their job applications efficiently.
        </p>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">Mission</h2>
          <p>
            Our mission is to simplify and organize your job search process with
            meaningful insights and clean UI.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold">Connect</h2>
          <ul className="list-disc list-inside">
            <li>
              <a
                href="https://github.com/Pomorskyi/application-tracker-app"
                className="text-blue-500 hover:underline"
              >
                GitHub Repository
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/mykhailo-pomorskyi/"
                className="text-blue-500 hover:underline"
              >
                My LinkedIn
              </a>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
