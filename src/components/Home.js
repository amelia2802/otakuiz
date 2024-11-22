import c1 from "../img/c1.png";
import c2 from "../img/c2.png";
import c3 from "../img/c3.png";
import c4 from "../img/c4.png";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <main className="home">
      <img className="corner-img top-left" src={c1} alt="Top-left corner" />
      <img className="corner-img top-right" src={c2} alt="Top-right corner" />
      <img className="corner-img bottom-right" src={c3} alt="Bottom-right corner" />
      <img className="corner-img bottom-left" src={c4} alt="Bottom-left corner" />

      <div className="menu">
        <h1>Otakuiz</h1>
        <p>Challenge Your Anime Knowledge</p>
          <Link to="/quiz"><button className="start-btn">Start Quiz</button></Link>
      </div>
    </main>
  );
}
