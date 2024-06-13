import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [examples, setExamples] = useState([['', '']]);
  const [response, setResponse] = useState('');

  const handleAddExample = () => {
    setExamples([...examples, ['', '']]);
  };

  const handleExampleChange = (index, field, value) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: 'POST',
        url: 'https://api.edenai.run/v2/text/question_answer',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNGMyNDNkNzEtYTY3Yy00NDM4LTgxNzItMjUxMTM5NzBkMThkIiwidHlwZSI6ImFwaV90b2tlbiJ9.uasnXWnUTXKZjUknfkGdyi_VnDfuO5QpOZzjRO_tUKc'
        },
        data: {
          response_as_dict: true,
          attributes_as_list: false,
          show_original_response: false,
          temperature: 1,
          providers: ['openai'],
          texts: [text],
          question: question,
          examples_context: context,
          examples: examples
        }
      };
      const res = await axios.request(options);
      setResponse(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Questionary Bot</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block mb-1">Text:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Context:</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        {examples.map((example, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-1">Example {index + 1}:</label>
            <input
              type="text"
              placeholder="Question"
              value={example[0]}
              onChange={(e) => handleExampleChange(index, 0, e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="Answer"
              value={example[1]}
              onChange={(e) => handleExampleChange(index, 1, e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        ))}
        <button type="button" onClick={handleAddExample} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
          Add Example
        </button>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
          Submit
        </button>
      </form>
      {response && (
        <div>
          <h2 className="text-xl font-bold mb-2">Response</h2>
          <pre className="bg-gray-200 p-4 rounded-md">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
