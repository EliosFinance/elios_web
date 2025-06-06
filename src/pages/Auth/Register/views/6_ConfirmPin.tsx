'use client';

import abstract1 from '@/assets/images/shapes/abstract_shape_1.png';
import { Button } from '@/components/ui/button';
import { useRegisterUsersStore } from '@/store/RegisterUser';
import APP_ROUTES_ENUM from '@/types/APP_ROUTES_ENUM';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterHeader from '../components/RegisterHeader';

const ConfirmPin: React.FC = () => {
    const [error, setError] = useState('');
    const { pin1: pinCode, pin2: confirmPin, setPin2: setConfirmPin } = useRegisterUsersStore();
    const navigate = useNavigate();

    const handlePinInput = (digit: string) => {
        if (confirmPin.length < 4) {
            setError('');
            setConfirmPin(confirmPin + digit);
        }
    };

    const handleDelete = () => {
        setError('');
        setConfirmPin(confirmPin.slice(0, -1));
    };

    const handleNext = () => {
        if (confirmPin.length === 4) {
            if (confirmPin === pinCode) {
                navigate(APP_ROUTES_ENUM.TERMS);
            } else {
                setError('Les codes PIN ne correspondent pas. Veuillez réessayer.');
                setConfirmPin('');
            }
        } else {
            setError('Veuillez entrer un code PIN à 4 chiffres.');
        }
    };

    return (
        <div className='h-screen w-full flex flex-col bg-white px-4'>
            <RegisterHeader title='Confirmez votre code PIN' />

            <div className='flex-1 flex flex-col justify-center items-center gap-6 max-w-md w-full mx-auto'>
                {/* Points indicateurs */}
                <div className='flex justify-center mt-10 mb-4'>
                    {[...Array(4)].map((_, idx) => (
                        <span
                            key={idx}
                            className={`w-3 h-3 mx-2 rounded-full ${
                                idx < confirmPin.length ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>

                {/* Pavé numérique */}
                <div className='relative flex items-center justify-center'>
                    <img
                        src={abstract1}
                        alt='Background'
                        className='absolute w-64 h-64 opacity-40 pointer-events-none'
                    />
                    <div className='grid grid-cols-4 gap-4 z-10'>
                        {[...'1234567890'].map((digit) => (
                            <button
                                key={digit}
                                className='flex items-center justify-center text-xl font-bold text-gray-800 bg-gray-200 rounded-full w-14 h-14 hover:bg-gray-300'
                                onClick={() => handlePinInput(digit)}
                            >
                                {digit}
                            </button>
                        ))}

                        {/* Delete button centered below */}
                        <div className='col-span-2 flex justify-center'>
                            <button
                                className='flex items-center justify-center text-xl text-red-600 bg-red-200 rounded-full w-14 h-14 hover:bg-red-300'
                                onClick={handleDelete}
                            >
                                ⌫
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

export default ConfirmPin;
