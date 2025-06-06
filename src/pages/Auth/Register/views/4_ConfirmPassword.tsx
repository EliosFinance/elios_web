import { Button } from '@/components/ui/button.tsx';
import { useRegisterUsersStore } from '@/store/RegisterUser';
import APP_ROUTES_ENUM from '@/types/APP_ROUTES_ENUM';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterHeader from '../components/RegisterHeader';

const ConfirmPassword: React.FC = () => {
    const [error, setError] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(false);

    const {
        password1: password,
        password2: confirmPassword,
        setPassword2: setConfirmPassword,
    } = useRegisterUsersStore();

    const navigate = useNavigate();

    const handleNext = () => {
        if (confirmPassword.length > 0 && confirmPassword !== password) {
            setError('Les mots de passe ne correspondent pas. Veuillez réessayer.');
        } else {
            setError('');
            navigate(APP_ROUTES_ENUM.CREATE_PIN);
        }
    };

    useEffect(() => {
        const validatePassword = () => {
            const conditions = [
                confirmPassword.length >= 8,
                /[0-9]/.test(confirmPassword),
                /[;_/!@#$%^&*(),.?":{}|<>]/.test(confirmPassword),
                /[A-Z]/.test(confirmPassword),
                /[a-z]/.test(confirmPassword),
                password === confirmPassword,
            ];
            setIsValid(conditions.every((condition) => condition));
        };

        validatePassword();
    }, [confirmPassword, password]);

    return (
        <div className='h-screen w-full flex flex-col bg-white dark:bg-gray-900 px-4'>
            <RegisterHeader title='Confirmez votre mot de passe Elios' />

            {/* Bloc central avec un espacement sous le titre */}
            <div className='flex-1 flex flex-col justify-center items-center text-center max-w-lg mx-auto w-full gap-6 mt-10'>
                <input
                    type='password'
                    placeholder='Confirmez votre mot de passe'
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                    }}
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400'
                />

                {error && <p className='text-sm text-red-500 text-center -mt-2 -mb-2'>{error}</p>}

                <ul className='w-full text-base text-left text-gray-600 dark:text-gray-400 space-y-2'>
                    {[
                        { text: 'Au moins 8 caractères', condition: confirmPassword.length >= 8 },
                        { text: 'Au moins 1 nombre', condition: /[0-9]/.test(confirmPassword) },
                        {
                            text: 'Au moins 1 caractère spécial',
                            condition: /[;_/!@#$%^&*(),.?":{}|<>]/.test(confirmPassword),
                        },
                        { text: 'Au moins 1 lettre majuscule', condition: /[A-Z]/.test(confirmPassword) },
                        { text: 'Au moins 1 lettre minuscule', condition: /[a-z]/.test(confirmPassword) },
                        { text: 'Les deux mots de passe correspondent', condition: password === confirmPassword },
                    ].map(({ text, condition }, idx) => (
                        <li key={idx} className='flex items-center'>
                            <span className={`mr-2 ${condition ? 'text-green-500' : 'text-red-500'}`}>
                                {condition ? '✓' : '✗'}
                            </span>
                            {text}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Bouton bas avec espace au-dessus */}
            <div className='w-full max-w-lg mx-auto px-2 mt-6 pb-40'>
                <Button
                    onClick={handleNext}
                    disabled={!isValid}
                    className={`w-full py-3 rounded-full text-base font-semibold text-center transition ${
                        isValid
                            ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Suivant
                </Button>
            </div>
        </div>
    );
};

export default ConfirmPassword;
