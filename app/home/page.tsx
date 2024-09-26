"use client";

import Navigation from "../components/Navigation";

const HomePage: React.FC = () => {
  return (
    <main className="bg-black text-slate-50 h-[100vh] w-[100vw]">
      <Navigation />
      <section>
        <h1>Welcome to the Home Page</h1>
        <p>This is the home page of your application.</p>
      </section>
    </main>
  );
};

export default HomePage;
