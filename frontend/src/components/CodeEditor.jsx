import React, { useState, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import { BiCopy } from 'react-icons/bi';
import { FaSun, FaMoon } from 'react-icons/fa';
import { FiPlus, FiMinus } from 'react-icons/fi';

const CodeEditor = () => {
    const [code, setCode] = useState('// Write your code here...');
    const [language, setLanguage] = useState('cpp');
    const [theme, setTheme] = useState('dark');
    const [fontSize, setFontSize] = useState(14);
    const [output, setOutput] = useState('');
    const [customInput, setCustomInput] = useState('');
    const editorRef = useRef();
    const containerRef = useRef();
    const [editorHeight, setEditorHeight] = useState(70);

    const handleEditorChange = (value) => {
        setCode(value);
    };

    const handleInput = (e) => {
        setCustomInput(e.target.value);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code);
        alert('Code copied to clipboard!');
    };

    const handleCopyInput = () => {
        navigator.clipboard.writeText(customInput);
        alert('Input copied to clipboard');
    };

    const handleCopyOutput = () => {
        navigator.clipboard.writeText(output);
        alert('Output copied to clipboard');
    };

    const handleThemeToggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleFontSizeChange = (increment) => {
        setFontSize(fontSize + increment);
    };

    const handleRunCode = async () => {
        const languageVersionMap = {
            javascript: '18.15.0',
            typescript: '5.0.3',
            python: '3.10.0',
            java: '15.0.2',
            csharp: '6.12.0',
            c: '10.2.0',
            cpp: '10.2.0',
        };

        const version = languageVersionMap[language];

        try {
            const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: language,
                version: version,
                files: [{ content: code }],
                stdin: customInput,
            });

            setOutput(response.data.run.output);
        } catch (error) {
            console.error('Error running code:', error);
            setOutput('Error running code');
        }
    };

    const handleMouseDown = (e) => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const containerHeight = containerRef.current.offsetHeight;
        const newEditorHeight = (e.clientY / containerHeight) * 100;
        setEditorHeight(newEditorHeight);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div ref={containerRef} className={`w-full h-screen p-4 flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className="flex justify-between mb-4">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="p-2 bg-white border rounded"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                </select>
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleFontSizeChange(1)} className="p-2 bg-gray-200 rounded">
                        <FiPlus />
                    </button>
                    <button onClick={() => handleFontSizeChange(-1)} className="p-2 bg-gray-200 rounded">
                        <FiMinus />
                    </button>
                    <button onClick={handleThemeToggle} className="p-2 bg-gray-200 rounded">
                        {theme === 'light' ? <FaMoon /> : <FaSun />}
                    </button>
                    <button onClick={handleCopyCode} className="p-2 bg-gray-200 rounded">
                        <BiCopy />
                    </button>
                    <button onClick={handleRunCode} className="p-2 bg-gray-200 rounded">
                        Run Code
                    </button>
                </div>
            </div>
            <div className="flex-grow" style={{ height: `${editorHeight}%` }}>
                <MonacoEditor
                    height="100%"
                    language={language}
                    theme={theme === 'light' ? 'light' : 'vs-dark'}
                    value={code}
                    onChange={handleEditorChange}
                    options={{
                        fontSize: fontSize,
                        automaticLayout: true,
                    }}
                    editorDidMount={(editor) => {
                        editorRef.current = editor;
                    }}
                />
            </div>
            <div
                onMouseDown={handleMouseDown}
                className="h-2 bg-gray-400 cursor-row-resize"
            ></div>
            <div className="flex-grow flex mt-4 space-x-4" style={{ height: `${100 - editorHeight - 2}%` }}>
                <div className={`w-1/2 p-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded resize-y overflow-auto`}>
                    <h2 className="text-lg font-bold">Custom Input:</h2>
                    <button onClick={handleCopyInput} className="p-2 bg-gray-400 rounded">
                        <BiCopy />
                    </button>
                    <textarea
                        value={customInput}
                        onChange={handleInput}
                        className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                        rows="4"
                    />
                </div>
                <div className={`w-1/2 p-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded resize-y overflow-auto`}>
                    <h2 className="text-lg font-bold">Output:</h2>
                    <button onClick={handleCopyOutput} className="p-2 bg-gray-400 rounded">
                        <BiCopy />
                    </button>
                    <pre>{output}</pre>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
