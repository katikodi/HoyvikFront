import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

type LoginFormProps = {
    onLogin: (email: string, password: string) => Promise<void>;
    error?: string | null;
};

export function LoginForm({ onLogin, error, className, ...props }: LoginFormProps & React.ComponentProps<"div">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        console.log("SUBMIT");

        await onLogin(email, password);
    }

    return (
        <div
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>

                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="m@example.com"
                                    required
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>

                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>

                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <Button type="submit">Login</Button>

                                <Button
                                    variant="outline"
                                    type="button"
                                >
                                    Login with Google
                                </Button>

                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <a href="#">Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
