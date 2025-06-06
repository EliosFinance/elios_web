import { Button } from '@/components/ui/button.tsx';
import { useRegisterUsersStore } from '@/store/RegisterUser';
import APP_ROUTES_ENUM from '@/types/APP_ROUTES_ENUM';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterHeader from '../components/RegisterHeader';

const CreateUsername: React.FC = () => {
    const [isValid, setIsValid] = useState<boolean>(false);
    const { username, setUsername } = useRegisterUsersStore();
    const navigate = useNavigate();

    const handleNext = () => {
        if (!isValid) return;
        setUsername(username);
        navigate(APP_ROUTES_ENUM.CREATE_PASSWORD);
    };

    useEffect(() => {
        const validateUsername = () => {
            const conditions = [username.length >= 5, !/[^a-zA-Z0-9]/.test(username)];
            setIsValid(conditions.every((condition) => condition));
        };

        validateUsername();
    }, [username]);

    return (
        <div className='h-screen w-full flex flex-col bg-white px-4'>
            {/* Header */}
            <RegisterHeader title="Créez votre nom d'utilisateur" />

            {/* Contenu centré */}
            <div className='flex-1 flex flex-col justify-center items-center text-center max-w-lg mx-auto w-full gap-6'>
                {/* Champ de saisie */}
                <input
                    type='text'
                    placeholder="Votre nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base'
                />

                {/* Règles de validation */}
                <ul className='w-full text-base text-left text-gray-600 space-y-2'>
                    {[
                        { text: 'Au moins 5 caractères', condition: username.length >= 5 },
                        { text: 'Pas de caractères spéciaux', condition: !/[^a-zA-Z0-9]/.test(username) },
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

            {/* Bouton bas */}
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

export default CreateUsername;
