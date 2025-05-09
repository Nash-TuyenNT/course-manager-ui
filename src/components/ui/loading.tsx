'use client';

export default function Loading({ message }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col items-center justify-center cursor-wait">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-solid mb-4" />
            {message && <p className="text-white text-sm">{message}</p>}
        </div>
    );
}
