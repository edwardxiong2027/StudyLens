import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, ChevronRight, RefreshCw } from 'lucide-react';

interface QuizWidgetProps {
  questions: QuizQuestion[];
}

export const QuizWidget: React.FC<QuizWidgetProps> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === questions[currentQuestion].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="text-6xl mb-2">
          {score === questions.length ? '🏆' : score > 0 ? '👏' : '📚'}
        </div>
        <h3 className="text-2xl font-bold text-white">Quiz Complete!</h3>
        <p className="text-gray-300">You scored <span className="text-cyan-400 font-bold">{score}</span> out of <span className="text-white">{questions.length}</span></p>
        <button 
          onClick={resetQuiz}
          className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors mt-4"
        >
          <RefreshCw size={20} /> Try Again
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded">Q{currentQuestion + 1}/{questions.length}</span>
        </h3>
        <div className="text-sm text-gray-400">Score: {score}</div>
      </div>

      <p className="text-lg text-white mb-6 font-medium leading-relaxed">{question.question}</p>

      <div className="space-y-3 flex-grow">
        {question.options.map((option, index) => {
          let optionClass = "w-full p-4 rounded-xl text-left transition-all border border-gray-700 bg-gray-800/50 hover:bg-gray-800";
          
          if (isAnswered) {
            if (index === question.correctIndex) {
              optionClass = "w-full p-4 rounded-xl text-left border border-green-500/50 bg-green-500/20 text-green-200";
            } else if (index === selectedOption) {
              optionClass = "w-full p-4 rounded-xl text-left border border-red-500/50 bg-red-500/20 text-red-200";
            } else {
              optionClass = "w-full p-4 rounded-xl text-left border border-transparent opacity-50";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered}
              className={optionClass}
            >
              <div className="flex justify-between items-center">
                <span>{option}</span>
                {isAnswered && index === question.correctIndex && <CheckCircle className="text-green-400" size={20} />}
                {isAnswered && index === selectedOption && index !== question.correctIndex && <XCircle className="text-red-400" size={20} />}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg mb-4 text-sm text-blue-200">
            <strong>Explanation:</strong> {question.explanation}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
