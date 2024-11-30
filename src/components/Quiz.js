import React, { useState, useEffect } from "react";
import he from "he";
import geto from "../img/submit.png";
import gojo from "../img/gojo.png";

export default function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null);

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
                if (i === retries - 1) throw error;
            }
        }
    };

    useEffect(() => {
        fetchQuestionsWithRetry("https://opentdb.com/api.php?amount=5&category=31&type=multiple")
            .then((data) => setQuestions(data.results || []))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            const shuffled = questions.map((item) => ({
                ...item,
                shuffledAnswers: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
            }));
            setShuffledQuestions(shuffled);
        }
    }, [questions]);

    const handleAnswerSelect = (questionIndex, selectedAnswer) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: selectedAnswer,
        }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        shuffledQuestions.forEach((item, index) => {
            if (selectedAnswers[index] === item.correct_answer) {
                correctCount++;
            }
        });
        setScore(correctCount);
    };

    return (
        <section className="quiz">
            <ul className="trivia">
                {shuffledQuestions.map((item, index) => (
                    <li key={index}>
                        <h2>{he.decode(item.question)}</h2>
                        <ul className="answer">
                            {item.shuffledAnswers.map((answer, i) => (
                                <div
                                    className={`options ${
                                        score !== null
                                            ? answer === item.correct_answer
                                                ? "correct"
                                                : selectedAnswers[index] === answer
                                                ? "incorrect"
                                                : ""
                                            : ""
                                    }`}
                                    key={i}
                                >
                                    <input
                                        type="radio"
                                        id={`q${index}_a${i}`}
                                        name={`question_${index}`}
                                        value={answer}
                                        onChange={() => handleAnswerSelect(index, answer)}
                                        disabled={score !== null} // Disable inputs after submission
                                    />
                                    <label htmlFor={`q${index}_a${i}`}>{he.decode(answer)}</label>
                                </div>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            <div className="submit">
                <img className="sbmit-img1" src={gojo} alt="submit" />
                <button className="submit-btn" onClick={handleSubmit} disabled={score !== null}>
                    Submit
                </button>
                <img className="sbmit-img2" src={geto} alt="submit" />
            </div>
            {score !== null && (
                <div className="score">
                    <h3>Your Score: {score}/{shuffledQuestions.length}</h3>
                </div>
            )}
        </section>
    );
}
