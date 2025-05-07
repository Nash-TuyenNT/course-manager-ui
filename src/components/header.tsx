'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from './auth-provider';

export default function Header() {
    const { isAuthenticated, logout } = useAuth();
    return (
        <header className="w-full border-b shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-black dark:text-white">
                    CourseManage
                </Link>

                <div className="flex-1 mx-6 max-w-md">
                    <Input placeholder="Search for course, teacher..." />
                </div>

                <div className="flex items-center gap-4">
                    {!isAuthenticated ? (
                        <>
                            <Link href="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Register</Button>
                            </Link>
                        </>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarFallback>TN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => logout()}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
