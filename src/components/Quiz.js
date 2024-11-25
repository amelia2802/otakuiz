import React, { useState, useEffect } from "react";
import he from "he";
import geto from "../img/submit.png"
import gojo from "../img/gojo.png"
export default function Quiz() {
    const [questions, setQuestions] = useState([])
    //const [error, setError] = useState(false);
    const fetchQuestionsWithRetry = async (url, retries = 3, backoff = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url);
                if (response.ok) return response.json();
                if (response.status === 429) {
                    console.warn("Rate limit hit. Retrying...");
                    await new Promise((resolve) => setTimeout(resolve, backoff));
                } else {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
            } catch (error) {
                console.error("Fetch attempt failed:", error);
                if (i === retries - 1) throw error; // Throw if final retry fails
            }
        }
    };
    
    useEffect(() => {
        fetchQuestionsWithRetry("https://opentdb.com/api.php?amount=5&category=31&type=multiple")
            .then((data) => setQuestions(data.results || []))
            .catch((err) => console.error(err));
    }, []);
    

    return (
        <section className="quiz">
                <ul className="trivia">
                {questions.map((item, index) => (
                    <li key={index}>
                        <h2>{he.decode(item.question)}</h2>
                        <ul className="answer">
                            {[
                                ...item.incorrect_answers,
                                item.correct_answer,
                            ]
                                .sort(() => Math.random() - 0.5)
                                .map((answer, i) => (
                                    <div className="options" key={i}>
                                        <input
                                            type="radio"
                                            id={`q${index}_a${i}`} // Unique id per question and answer
                                            name={`question_${index}`} // Group inputs by question
                                            value={answer}
                                        />
                                        <label htmlFor={`q${index}_a${i}`}>
                                            {he.decode(answer)}
                                        </label>
                                    </div>
                                ))}
                        </ul>
                    </li>
                ))}
                </ul>
                <div className="submit">
                    <img className="sbmit-img1" src={gojo} alt="submit" />
                    <button className="submit-btn">Submit</button>
                    <img className="sbmit-img2" src={geto} alt="submit" />
                </div>
        </section>
    );
}
