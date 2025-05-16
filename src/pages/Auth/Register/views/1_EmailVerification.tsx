import mailLogo from '@/assets/images/mail/mail_icon.png';
import { Button } from '@/components/ui/button.tsx';
import { useRegisterUsersStore } from '@/store/RegisterUser';
import APP_ROUTES_ENUM from '@/types/APP_ROUTES_ENUM';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterHeader from '../components/RegisterHeader';

const EmailVerification: React.FC = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const userEmail = decodeURIComponent(params.get('email')) || '';
    const { setEmail } = useRegisterUsersStore();

    const handleNext = () => {
        navigate(APP_ROUTES_ENUM.CREATE_USERNAME);
    };

    useEffect(() => {
        setEmail(userEmail);
    }, [userEmail]);

    return (
        <div className='h-screen w-full flex flex-col bg-white px-4 overflow-hidden'>
            <RegisterHeader title='Vérifiez votre adresse mail' />

            {/* Contenu principal élargi */}
            <div className='flex-1 flex flex-col justify-center items-center text-center max-w-lg mx-auto gap-6'>
                <img src={mailLogo} alt='Mail Logo' className='w-24 h-24' />

                <p className='text-base text-gray-600'>
                    Cliquez sur le lien de vérification qui vient d’être envoyé à l’adresse :
                </p>
                <p className='text-base font-semibold text-gray-800'>{userEmail}</p>

                <p className='text-base text-gray-600'>
                    Vous n’avez pas reçu d’email ?{' '}
                    <button className='font-semibold text-blue-500 hover:underline'>Renvoyer</button>
                </p>
            </div>

            {/* Boutons élargis */}
            <div className='w-full max-w-lg mx-auto px-2 pb-6 flex flex-col gap-3'>
                <Button className='w-full py-3 text-base text-white bg-blue-500 rounded-full hover:bg-blue-600'>
                    Ouvrir mon application d'email
                </Button>
                <Button
                    onClick={handleNext}
                    className='w-full py-3 text-base font-bold text-gray-800 bg-gray-100 rounded-full hover:bg-gray-200'
                >
                    Plus tard
                </Button>
            </div>
        </div>
    );
};

export default EmailVerification;
