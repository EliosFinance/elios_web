import { login_google } from '@/api';
import mainLogo from '@/assets/images/corp/main_logo.png';
import appleIcon from '@/assets/images/icons/apple_icon.png';
import { Button } from '@/components/ui/button.tsx';
import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { OsEnum, useDeviceDetection } from '@/hook/useDeviceDetection';
import { userStore } from '@/store/UserStore.ts';
import APP_ROUTES_ENUM from '@/types/APP_ROUTES_ENUM';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import { GoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import DrawerStep1 from './Login/DrawerStep1';
import DrawerStep2 from './Login/DrawerStep2';
import PinVerification from './Login/PinVerification';

const Authenticate: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [drawerStep, setDrawerStep] = useState<'step1' | 'step2' | 'step3'>('step1');
    const [dataForStep3, setDataForStep3] = useState<{ email: string; password: string } | null>(null);
    const { os } = useDeviceDetection();
    const navigate = useNavigate();
    const updateUser = userStore((state) => state.updateUser);

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = () => {
        if (!isValidEmail(email)) {
            setError('Veuillez entrer une adresse email valide.');
            return;
        }
        setError(null);
        navigate({
            pathname: APP_ROUTES_ENUM.VERIFY_EMAIL,
            search: createSearchParams({
                email: encodeURIComponent(email),
            }).toString(),
        });
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen w-full px-8 bg-white dark:bg-gray-900'>
            <div className='w-full max-w-xl flex flex-col items-center gap-6'>
                {/* Titre + logo */}
                <div className='flex flex-col items-center'>
                    <img src={mainLogo} alt='Elios Logo' className='w-20 h-20 mb-2 rounded-4' />
                    <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100 text-center w-full leading-snug'>
                        Créez un compte pour sauvegarder vos réponses
                    </h1>

                    <div className='flex flex-col items-center mt-2'>
                        <div className='flex'>
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='w-4 h-4 text-yellow-400'
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                >
                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.327 4.086a1 1 0 00.95.69h4.294c.969 0 1.371 1.24.588 1.81l-3.475 2.535a1 1 0 00-.364 1.118l1.327 4.086c.3.921-.755 1.688-1.538 1.118l-3.475-2.535a1 1 0 00-1.176 0l-3.475 2.535c-.783.57-1.838-.197-1.538-1.118l1.327-4.086a1 1 0 00-.364-1.118L2.22 9.513c-.783-.57-.38-1.81.588-1.81h4.294a1 1 0 00.95-.69l1.327-4.086z' />
                                </svg>
                            ))}
                        </div>
                        <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>noté 4.98/5 - 4324 notes</p>
                    </div>
                </div>

                {/* Email input + bouton */}
                <div className='flex flex-col items-center justify-center w-full'>
                    <input
                        id='email'
                        type='email'
                        placeholder='Votre email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-2 border-b-2 text-sm bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:font-medium text-gray-800 dark:text-gray-100 focus:outline-none ${
                            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                    />
                    {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}

                    <Button
                        onClick={handleSubmit}
                        className='w-full py-2 mt-3 text-sm font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:ring-2 focus:ring-blue-400'
                    >
                        Suivant
                    </Button>

                    <div className='flex items-center w-full my-4'>
                        <hr className='flex-grow border-gray-300 dark:border-gray-600' />
                        <span className='mx-4 text-xs text-gray-500 dark:text-gray-400'>ou</span>
                        <hr className='flex-grow border-gray-300 dark:border-gray-600' />
                    </div>
                </div>

                {/* Login buttons */}
                <div className='flex flex-col w-full space-y-2'>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            const loginGoogle = await login_google(credentialResponse.credential);
                            if (!loginGoogle) return;
                            updateUser({
                                username: loginGoogle.username,
                                token: loginGoogle.access_token,
                                refresh_token: loginGoogle.refresh_token,
                                powens_token: loginGoogle.powens_token,
                            });
                            navigate(APP_ROUTES_ENUM.HOME);
                        }}
                        onError={() => console.log('Login Failed')}
                        shape='pill'
                        text='continue_with'
                        width='100%'
                    />

                    {(os === OsEnum.IOS || os === OsEnum.WEB) && (
                        <Button className='flex items-center justify-center w-full border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-full bg-transparent hover:bg-gray-300 dark:hover:bg-gray-700 py-2'>
                            <img src={appleIcon} alt='Apple' className='h-4 mr-2' />
                            <span className='text-sm'>Continuer avec Apple</span>
                        </Button>
                    )}

                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button className='w-full border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 py-2 rounded-full bg-transparent hover:bg-gray-300 dark:hover:bg-gray-700'>
                                J'ai déjà un compte
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className='bg-white dark:bg-gray-900'>
                            <Button
                                className='absolute p-2 top-2 left-4 bg-transparent rounded-full'
                                onClick={() => {
                                    if (drawerStep === 'step2') {
                                        setDrawerStep('step1');
                                        setDataForStep3(null);
                                    } else if (drawerStep === 'step3') {
                                        setDrawerStep('step2');
                                    }
                                }}
                            >
                                <ArrowLeftCircleIcon className='w-6 h-6 text-gray-800 dark:text-gray-100' />
                            </Button>
                            <DrawerClose className='absolute top-2 right-4'>
                                <Button
                                    className='p-2 bg-transparent rounded-full'
                                    onClick={() => setDrawerStep('step1')}
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='w-6 h-6 text-gray-800 dark:text-gray-100'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M6 18L18 6M6 6l12 12'
                                        />
                                    </svg>
                                </Button>
                            </DrawerClose>
                            <DrawerTitle className='hidden' />
                            {drawerStep === 'step1' && <DrawerStep1 onNext={() => setDrawerStep('step2')} />}
                            {drawerStep === 'step2' && (
                                <DrawerStep2
                                    onNext={() => setDrawerStep('step3')}
                                    setDataForStep3={(email, password) => setDataForStep3({ email, password })}
                                />
                            )}
                            {drawerStep === 'step3' && dataForStep3 && <PinVerification />}
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </div>
    );
};

export default Authenticate;
