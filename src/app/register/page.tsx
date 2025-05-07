'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { register } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        username: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            await register(form.username, form.password, form.role, form.email)

            router.push('/login');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6 bg-white dark:bg-black p-6 rounded-xl shadow dark:bg-gray-900"
            >
                <h1 className="text-xl font-semibold text-center">Create an Account</h1>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" onChange={handleChange} required />
                </div>

                <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" type="text" onChange={handleChange} required />
                </div>

                <div>
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" name="role" type="text" onChange={handleChange} required />
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" onChange={handleChange} required />
                </div>

                <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" onChange={handleChange} required />
                </div>

                {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                <Button type="submit" className="w-full">Register</Button>
            </form>
        </div>
    );
}
