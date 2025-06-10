import appleIcon from '@/assets/images/icons/apple_icon.png';
import googleIcon from '@/assets/images/icons/google_icon.png';
import { Button } from '@/components/ui/button.tsx';
import React from 'react';

interface DrawerStep1Props {
    onNext: () => void;
}

const DrawerStep1: React.FC<DrawerStep1Props> = ({ onNext }) => {
    return (
        <div className='p-4 mb-10'>
            <div className='mb-6 text-center'>
                <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100'>Se connecter</h2>
            </div>
            <div className='flex flex-col space-y-3'>
                <Button
                    className='w-full bg-gray-200 dark:bg-gray-700 border-solid border-[1.5px] border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600'
                    onClick={onNext}
                >
                    J'entre mes identifiants
                </Button>
                <Button className='flex items-center justify-center w-full border-solid border-[1.5px] border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-full bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600'>
                    <img src={googleIcon} alt='Google' className='w-auto h-4 mr-3' />
                    <span className='text-sm'>Continuer avec Google</span>
                </Button>
                <Button className='flex items-center justify-center w-full border-solid border-[1.5px] border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-full bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600'>
                    <img src={appleIcon} alt='Apple' className='h-4 mr-3 w-auto' />
                    <span className='text-sm'>Continuer avec Apple</span>
                </Button>
            </div>
        </div>
    );
};

export default DrawerStep1;
