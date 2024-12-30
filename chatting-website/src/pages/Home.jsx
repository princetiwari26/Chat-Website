import React from "react";
import UserSection from "../components/UserSection";
import HeaderSection from "../components/HeaderSection";

function Home() {
  return (
    <div>
      <HeaderSection/>

      <main>
        <div><UserSection/></div>
      </main>
    </div>
  );
}

export default Home;
