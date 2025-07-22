import React, { useEffect } from 'react'
import { usePuterStore } from 'lib/puter'
import { useLocation, useNavigate } from 'react-router'

export const meta = () => {
    return [
        { title: 'Resumind | Auth' },
        { name: 'description', content: 'Log into your Account' },
    ]
}

const Auth = () => {
    const { isLoading, auth } = usePuterStore();

    const location = useLocation();
    const next = location.search.split("next=")[1] || "/";
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next, { replace: true });
    }, [auth.isAuthenticated, next]);


    return (
        <main className='main-background'>
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col p-8 gap-8 bg-white rounded-2xl">
                    <div className="flex flex-col gap-2 items-center text-center">
                        <h1>Welcome</h1>
                        <h2>Log in to continue your job journey!</h2>
                    </div>

                    <div className="">
                        {isLoading ? (
                            <button
                                type='button' className="auth-button animate-pulse">
                                <span>Signing you in...</span>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button type='button' className='auth-button' onClick={auth.signOut}>
                                        <span>Sign Out</span>
                                    </button>
                                ) : (
                                    <button type='button' className='auth-button' onClick={auth.signIn}>
                                        <span>Log In</span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth