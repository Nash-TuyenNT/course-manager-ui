'use client'

import { Question } from "@/types/question"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"



export default function QuizQuestionForm({ questions, setQuestions }:
    { questions: Question[], setQuestions: React.Dispatch<React.SetStateAction<Question[]>> }) {

    const handleChange = (index: number, field: keyof Question, value: string) => {
        const updated = [...questions]
        if (field === 'choices') return // prevent invalid usage
        updated[index][field] = value
        setQuestions(updated)
    }

    const handleChoiceChange = (qIndex: number, cIndex: number, value: string) => {
        const updated = [...questions]
        updated[qIndex].choices[cIndex] = value
        setQuestions(updated)
    }

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { question: '', choices: [' ', ' ', ' ', ' '], correct_answer: '' }
        ])
    }

    return (
        <div className="space-y-8">
            {questions.map((q, i) => (
                <div key={i} className="border p-4 rounded shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">Question {i + 1}</h3>
                    <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleChange(i, 'question', e.target.value)}
                        placeholder="Nhập câu hỏi"
                        className="w-full border p-2 rounded mb-3"
                    />

                    <div className="grid grid-cols-2 gap-4 mb-3">
                        {q.choices.map((choice, ci) => (
                            <input
                                key={ci}
                                type="text"
                                value={choice}
                                onChange={(e) => handleChoiceChange(i, ci, e.target.value)}
                                placeholder={`Lựa chọn ${ci + 1}`}
                                className="border p-2 rounded"
                            />
                        ))}
                    </div>

                    <Select
                        value={q.correct_answer}
                        onValueChange={(value) => handleChange(i, 'correct_answer', value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Choose the correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                            {q.choices.map((choice, idx) => (
                                <SelectItem key={idx} value={choice}>{choice || `Option ${idx + 1}`}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ))}

            <button
                onClick={addQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                + Add question
            </button>
        </div>
    )
}
