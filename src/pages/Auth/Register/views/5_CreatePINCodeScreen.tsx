import abstract1 from '@/assets/images/shapes/abstract_shape_1.png';
import { Button } from '@/components/ui/button';
import { useRegisterUsersStore } from '@/store/RegisterUser';
import APP_ROUTES_ENUM from '@/types/APP_ROUTES_ENUM';
import { DeleteIcon } from 'lucide-react'; // icône plus moderne
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterHeader from '../components/RegisterHeader';

const PinCodeScreen: React.FC = () => {
    const [error, setError] = useState('');
    const { pin1: pin, setPin1: setPin } = useRegisterUsersStore();
    const navigate = useNavigate();

    const handlePinInput = (digit: string) => {
        if (pin.length < 4) {
            setError('');
            setPin(pin + digit);
        }
    };

    const handleDelete = () => {
        setError('');
        setPin(pin.slice(0, -1));
    };

    const handleNext = () => {
        if (pin.length === 4) {
            setPin(pin);
            navigate(APP_ROUTES_ENUM.CONFIRM_PIN);
        } else {
            setError('Veuillez entrer un code PIN à 4 chiffres.');
        }
    };

    return (
        <div className='h-screen w-full flex flex-col bg-white dark:bg-gray-900 px-4'>
            <RegisterHeader title='Créez votre code PIN' />

            <div className='flex-1 flex flex-col justify-center items-center gap-6 max-w-md w-full mx-auto'>
                {/* Points indicateurs */}
                <div className='flex justify-center mt-2 mb-4'>
                    {[...Array(4)].map((_, idx) => (
                        <span
                            key={idx}
                            className={`w-3 h-3 mx-2 rounded-full ${
                                idx < pin.length ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        />
                    ))}
                </div>

                {/* Pavé numérique avec image en fond */}
                <div className='relative flex items-center justify-center'>
                    <img
                        src={abstract1}
                        alt='Background'
                        className='absolute w-100 h-100 opacity-40 pointer-events-none' // agrandi
                    />
                    <div className='grid grid-cols-4 gap-4 z-10'>
                        {[...'1234567890'].map((digit) => (
                            <button
                                key={digit}
                                className='flex items-center justify-center text-xl font-bold text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 rounded-full w-14 h-14 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
                                onClick={() => handlePinInput(digit)}
                            >
                                {digit}
                            </button>
                        ))}

                        {/* Bouton delete modernisé */}
                        <div className='col-span-2 flex justify-center'>
                            <button
                                className='flex items-center justify-center text-xl text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 rounded-full w-14 h-14 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
                                onClick={handleDelete}
                            >
                                <DeleteIcon className='w-6 h-6' />
                            </button>
                        </div>
                    </div>
                </div>

                {error && <p className='text-sm text-red-500 mt-2'>{error}</p>}
            </div>

            {/* Bouton Suivant */}
            <div className='w-full max-w-md mx-auto px-2 pb-10 mt-10'>
                <Button
                    onClick={handleNext}
                    className='w-full py-3 rounded-full text-base font-semibold text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400'
                >
                    Suivant
                </Button>
            </div>
        </div>
    );
};

export default PinCodeScreen;
