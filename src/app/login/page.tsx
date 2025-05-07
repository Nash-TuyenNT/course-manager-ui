'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { authenticate } from '@/lib/api';
import { useAuth } from '@/components/auth-provider';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { login } = useAuth();
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await authenticate(username, password)
            login(res.access_token)
            router.push('/');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl shadow-xl dark:bg-gray-900"
            >
                <h2 className="text-xl font-semibold text-center">Login</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <Button type="submit" className="w-full">
                    Login
                </Button>
                <p className="text-sm text-center">
                    Don’t have an account?{' '}
                    <a href="/register" className="text-blue-600 hover:underline">Register</a>
                </p>

            </form>
        </div>
    );
}
