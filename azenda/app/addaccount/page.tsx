'use client';

import { useState } from 'react';

// Regular expression to allow only letters and numbers for username
const usernameRegex = /^[a-zA-Z0-9]+$/;





const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const[sleep_start, setSleepStart] = useState(0);
    const[sleep_end, setSleepEnd] = useState(16);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) =>
    {
        event.preventDefault();

        // Validate username format before submitting
        if (!usernameRegex.test(username)) {
            setError('Username can only contain letters and numbers.');
            return;
        }

        //calls the create account function in backend
        const response = await fetch(`http://localhost:8000/api/createaccount/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password, sleep_start, sleep_end}),
        });


        //Case Handling

        //Username already exists, so deny
        if(response.status==200)
        {
            setError('Username already exists.')
            return;
        }

        //something bad happened, pray
        else if(response.status==500)
        {
            setError('Internal server error')
            return;
        }

        //valid username, add it to database
        else if(response.status == 201)
        {
            window.location.href = '/';
        }
    };

    //handles form submission, essentially all the little input bars, each name corresponds to what info its storing
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#9ab18c' }}>
            <div className="p-8 rounded shadow-md max-w-md w-full" style={{ backgroundColor: '#778e65' }}>
                <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-black-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-black-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="sleep_start" className="block text-sm font-medium text-black-700">Start of your Sleep Cycle</label>
                        <input
                            type="number"
                            id="sleep_start"
                            value={sleep_start}
                            onChange={(e) => setSleepStart(Number(e.target.value))}
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="sleep_end" className="block text-sm font-medium text-black-700">End of your Sleep Cycle</label>
                        <input
                            type="number"
                            id="sleep_end"
                            value={sleep_end}
                            onChange={(e) => setSleepEnd(Number(e.target.value))}
                            required
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? '#cccccc' : '#b5b5ec', // Custom color for loading and normal states
                            color: '#ffffff', // Text color
                        }}
                        className="w-full py-2 px-4 font-semibold rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-opacity-75"
                    >
                        {loading ? '...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
