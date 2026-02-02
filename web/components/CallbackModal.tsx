'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CallbackModalProps {
    children?: React.ReactNode;
    triggerText?: string;
    className?: string;
}

export function CallbackModal({ children, triggerText = "Request Callback", className }: CallbackModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            full_name: formData.get('full_name'),
            phone_number: formData.get('phone_number'),
            message: formData.get('message'),
        };

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setOpen(false);
                    setSuccess(false);
                }, 3000);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button className={className}>{triggerText}</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Talk to an Expert 📞</DialogTitle>
                    <DialogDescription>
                        Fill in your details below and our academic counselor will call you shortly.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Request Sent!</h3>
                        <p className="mt-1 text-sm text-gray-500">We will contact you soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input id="full_name" name="full_name" placeholder="Dr. John Doe" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <Input id="phone_number" name="phone_number" type="tel" placeholder="+91 98765 43210" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">Message (Optional)</Label>
                            <Textarea id="message" name="message" placeholder="I have a query about AIAPGT Course..." />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800">
                            {loading ? 'Sending...' : 'Request Callback'}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
