import { Button } from '@/components/ui/button.tsx';
import { useRegisterUsersStore } from '@/store/RegisterUser';
import APP_ROUTES_ENUM from '@/types/APP_ROUTES_ENUM';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterHeader from '../components/RegisterHeader';

const CreatePassword: React.FC = () => {
    const [isValid, setIsValid] = useState<boolean>(false);
    const { password1: password, setPassword1: setPassword } = useRegisterUsersStore();
    const navigate = useNavigate();

    const handleNext = () => {
        if (!isValid) return;
        setPassword(password);
        navigate(APP_ROUTES_ENUM.CONFIRM_PASSWORD);
    };

    useEffect(() => {
        const validatePassword = () => {
            const conditions = [
                password.length >= 8,
                /[0-9]/.test(password),
                /[;_/!@#$%^&*(),.?":{}|<>]/.test(password),
                /[A-Z]/.test(password),
                /[a-z]/.test(password),
            ];
            setIsValid(conditions.every((condition) => condition));
        };

        validatePassword();
    }, [password]);

    return (
        <div className='h-screen w-full flex flex-col bg-white px-4'>
            {/* Header */}
            <RegisterHeader title='Créez votre mot de passe Elios' />

            {/* Contenu central */}
            <div className='flex-1 flex flex-col justify-center items-center text-center max-w-lg mx-auto w-full gap-6'>
                {/* Champ mot de passe */}
                <input
                    type='password'
                    placeholder='Votre mot de passe'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base'
                />

                {/* Liste de règles */}
                <ul className='w-full text-base text-left text-gray-600 space-y-2'>
                    {[
                        { text: 'Au moins 8 caractères', condition: password.length >= 8 },
                        { text: 'Au moins 1 nombre', condition: /[0-9]/.test(password) },
                        { text: 'Au moins 1 caractère spécial', condition: /[;_/!@#$%^&*(),.?":{}|<>]/.test(password) },
                        { text: 'Au moins 1 lettre majuscule', condition: /[A-Z]/.test(password) },
                        { text: 'Au moins 1 lettre minuscule', condition: /[a-z]/.test(password) },
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

            {/* Bouton "Suivant" */}
            <div className='w-full max-w-lg mx-auto px-2 pb-40'>
                <Button
                    onClick={handleNext}
                    disabled={!isValid}
                    className={`w-full py-3 rounded-full text-base font-semibold text-center transition ${
                        isValid
                            ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Suivant
                </Button>
            </div>
        </div>
    );
};

export default CreatePassword;
