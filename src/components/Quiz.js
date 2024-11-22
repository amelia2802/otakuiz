import React, { useState, useEffect } from "react";
import he from "he";
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
                    </li>
                ))}
                </ul>
        </section>
    );
}
