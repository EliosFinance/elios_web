import { logout_api } from '@/api/connexion/connexionCalls';
import { appOpen, getPinStatus, verifyPin } from '@/api/connexion/connexionCalls';
import { Button } from '@/components/ui/button.tsx';
import { userStore } from '@/store/UserStore';
import APP_ROUTES_ENUM from '@/types/APP_ROUTES_ENUM';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import { DeleteIcon } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterHeader from '../Register/components/RegisterHeader';

const PinVerification: React.FC = () => {
    const [pin, setPin] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [remainingAttempts, setRemainingAttempts] = useState<number>(3);
    const [isInitializing, setIsInitializing] = useState(true);
    const navigate = useNavigate();
    const user = userStore((state) => state.user);

    const resetAndLogout = useCallback(async () => {
        await logout_api();
        localStorage.removeItem('pinVerified');
        localStorage.removeItem('deviceId');
        navigate(APP_ROUTES_ENUM.LOGIN);
    }, [navigate]);

    const initializePin = useCallback(async () => {
        if (!user?.token) {
            navigate(APP_ROUTES_ENUM.LOGIN);
            return;
        }

        try {
            const deviceId = localStorage.getItem('deviceId');
            if (!deviceId) {
                setError('Erreur de configuration');
                return;
            }

            const response = await appOpen(deviceId);
            if (!response.requiresPin) {
                localStorage.setItem('pinVerified', 'true');
                navigate(APP_ROUTES_ENUM.HOME);
                return;
            }

            const pinStatus = await getPinStatus();
            if (pinStatus.isLocked) {
                await resetAndLogout();
                return;
            }

            setIsInitializing(false);
        } catch (error) {
            setError('Erreur de vérification: ' + (error as Error).message);
            setIsInitializing(false);
        }
    }, [user?.token, navigate, resetAndLogout]);

    useEffect(() => {
        initializePin();
    }, [initializePin]);

    const handlePinInput = (digit: string) => {
        if (pin.length < 6) {
            setPin((prev) => prev + digit);
            setError(null);
        }
    };

    const handleDelete = () => {
        setPin((prev) => prev.slice(0, -1));
        setError(null);
    };

    const handleVerify = useCallback(async () => {
        if (isInitializing) return;

        try {
            const deviceId = localStorage.getItem('deviceId');
            if (!deviceId) {
                setError('Erreur de configuration');
                return;
            }

            if (!user?.token) {
                navigate(APP_ROUTES_ENUM.LOGIN);
                return;
            }

            await verifyPin(pin, deviceId);
            localStorage.setItem('pinVerified', 'true');
            navigate(APP_ROUTES_ENUM.HOME);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || '';

            if (errorMessage.includes('PIN is locked')) {
                setError('PIN verrouillé. Veuillez vous reconnecter.');
                await resetAndLogout();
                return;
            }

            const attemptsMatch = errorMessage.match(/(\d+) attempts remaining/);
            if (attemptsMatch) {
                const attempts = parseInt(attemptsMatch[1]);
                setRemainingAttempts(attempts);
                setPin('');
                setError(
                    `Code PIN incorrect. ${attempts} tentative${attempts === 1 ? '' : 's'} restante${attempts === 1 ? '' : 's'}.`,
                );

                if (attempts <= 0) {
                    await resetAndLogout();
                }
            } else {
                setPin('');
                setError('Code PIN incorrect. Veuillez réessayer.');
            }
        }
    }, [pin, isInitializing, navigate, user?.token, resetAndLogout]);

    useEffect(() => {
        if (pin.length === 6 && !isInitializing) {
            handleVerify();
        }
    }, [pin, isInitializing, handleVerify]);

    if (isInitializing) {
        return (
            <div className='flex items-center justify-center w-full h-screen bg-white dark:bg-gray-900'>
                <div className='text-center'>
                    <div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-[spin_1s_linear_infinite]'></div>
                </div>
            </div>
        );
    }

    const renderPinCircle = (index: number) => (
        <span
            key={index}
            className={`w-4 h-4 mx-3 rounded-full ${
                index < pin.length ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
        />
    );

    const renderNumberButton = (
        number: number | string,
        onClick?: () => void,
        extraClass?: string,
        disabled = false,
    ) => (
        <Button
            key={number}
            className={`flex items-center justify-center text-2xl font-bold rounded-full w-20 h-20 transition-colors ${
                disabled
                    ? 'text-gray-400 dark:text-gray-500 bg-transparent'
                    : `text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 ${extraClass}`
            }`}
            onClick={onClick}
            disabled={disabled}
        >
            {typeof number === 'string' && number === 'fingerprint' ? (
                <FingerPrintIcon className='w-8 h-8' />
            ) : typeof number === 'string' && number === 'delete' ? (
                <DeleteIcon className='w-8 h-8' />
            ) : (
                number
            )}
        </Button>
    );

    return (
        <div className='flex flex-col items-center justify-start w-full h-screen px-4 pt-6 pb-8 bg-white dark:bg-gray-900'>
            <RegisterHeader title='Entrez votre code PIN' disableGoBack />

            <div className='flex flex-col items-center justify-center w-full h-full max-w-md mx-auto gap-10 pt-12'>
                {/* PIN indicators */}
                <div className='flex justify-center mb-6'>{[...Array(6)].map((_, idx) => renderPinCircle(idx))}</div>

                {/* PIN keypad */}
                <div className='relative z-10 grid grid-cols-3 gap-6'>
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((number) =>
                        renderNumberButton(number, () => handlePinInput(number.toString())),
                    )}
                    {renderNumberButton('fingerprint', undefined, '', true)}
                    {renderNumberButton(0, () => handlePinInput('0'))}
                    {renderNumberButton(
                        'delete',
                        handleDelete,
                        'text-red-600 bg-red-200 dark:bg-red-700 hover:bg-red-300 dark:hover:bg-red-600',
                    )}
                </div>

                {/* Error message */}
                {error && <p className='mt-6 text-sm text-red-500 text-center'>{error}</p>}
            </div>
        </div>
    );
};

export default PinVerification;
