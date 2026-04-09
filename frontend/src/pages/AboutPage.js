import React from "react";

function AboutPage() {
  return (
    <>
      <section className="about-topic">
        <h2>What I Love About My Hobbies</h2>
        <p>
          Gaming, movies, reading, and music shape who I am. I love hobbies each
          of them allows me to explore creativity, enjoy different stories,
          relax my mind, and also express my feelings. They make my free time
          fun and meaningful.
        </p>
      </section>
      <div className="card-container">
        <div className="card">
          <div className="wrapper">
            <img
              className="cover-image"
              src="kpopcover.jpg"
              alt="K-pop Cover"
            />
          </div>
          <img className="title" src="kpoplogo.png" alt="K-pop Logo" />
          <img className="character" src="kpoppng.png" alt="K-pop Character" />
        </div>

        <div className="card">
          <div className="wrapper">
            <img
              className="cover-image"
              src="mlcover1.jpg"
              alt="Mobile Legends Cover"
            />
          </div>
          <img className="title" src="mllogo1.png" alt="Mobile Legends Logo" />
          <img
            className="character"
            src="mlpng1.png"
            alt="Mobile Legends Character"
          />
        </div>

        <div className="card">
          <div className="wrapper">
            <img className="cover-image" src="btrcover1.jpg" alt="BTS Cover" />
          </div>
          <img className="title" src="btrlogo1.png" alt="BTS Logo" />
          <img className="character" src="btrpng1.png" alt="BTS Character" />
        </div>

        <div className="card">
          <div className="wrapper">
            <img
              className="cover-image"
              src="conancover1.jpg"
              alt="Conan Cover"
            />
          </div>
          <img className="title" src="conanlogo1.png" alt="Conan Logo" />
          <img
            className="character"
            src="conanpng1.png"
            alt="Conan Character"
          />
        </div>
      </div>

      <section className="my-journey">
        <h2>My Journey with These Hobbies</h2>
        <ol>
          <li>Gaming</li>
          <p>
            I started gaming in my high school years, and it became a fun way
            for me to relax and enjoy my free time.
          </p>
          <br />
          <li>Watching Movies</li>
          <p>
            I enjoy watching movies or series, especially fantasy and animated
            genres, because I love creative stories.
          </p>
          <br />
          <li>Reading Stories</li>
          <p>
            I started reading Wattpad stories out of curiosity, and I enjoyed
            using my imagination while reading, and I like reading romance
            stories because I enjoy emotional and heartfelt stories.
          </p>
          <br />
          <li>Listening to Music</li>
          <p>
            I began listening to music to relax, and it helps me express my
            feelings and improve my mood. I prefer listening to music that
            relaxes my mind, including sad songs that my feeling.
          </p>
          <br />
        </ol>
      </section>

      <blockquote>
        "Entertainment is the doorway to imagination—whether through games that
        challenge our minds, movies that stir our emotions, books that expand
        our horizons, or music that speaks to our souls." – Anonymous
      </blockquote>
    </>
  );
}

export default AboutPage;
