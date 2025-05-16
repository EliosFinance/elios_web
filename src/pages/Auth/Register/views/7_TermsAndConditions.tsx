import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';
import { useRegisterUsersStore } from '@/store/RegisterUser';
import APP_ROUTES_ENUM from '@/types/APP_ROUTES_ENUM';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterHeader from '../components/RegisterHeader';

const TermsAndConditions: React.FC = () => {
    const [isAccepted, setIsAccepted] = useState(false);
    const navigate = useNavigate();
    const { authenticate } = useAuth();
    const { email, username, password2: password, pin2, clear } = useRegisterUsersStore();

    const handleNext = async () => {
        if (!isAccepted) {
            alert('Veuillez accepter les conditions générales pour continuer.');
            return;
        }

        const canRegister = await authenticate('register', username, password, email);
        if (canRegister) {
            clear();
            navigate(APP_ROUTES_ENUM.HOME);
        } else {
            alert("Erreur lors de l'inscription");
        }
    };

    return (
        <div className='h-screen w-full flex flex-col bg-white px-4'>
            <RegisterHeader title="Conditions générales d'utilisation" />

            {/* Contenu principal scrollable et centré */}
            <div className='flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full gap-6 mt-6'>
                {/* Bloc texte scrollable */}
                <div className='w-full p-4 overflow-y-auto text-sm text-gray-700 border border-blue-300 rounded-lg max-h-64'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac lacus cursus risus posuere
                    pharetra sed eu turpis. Cras pulvinar elementum dolor, eget aliquam felis facilisis et. Fusce ante
                    risus, gravida vitae ante a, venenatis vestibulum nunc. Nam vitae ante fringilla leo vulputate
                    interdum. Cras et magna ac lorem elementum efficitur dapibus sed massa.
                    <br />
                    <br />
                    Nulla a risus vel orci pulvinar tristique non ut urna. Sed ut felis ex. Suspendisse vel erat sem.
                    Phasellus et vulputate sapien. In aliquet iaculis mi. Curabitur pulvinar sapien sed auctor pretium.
                    Sed sed porta est, eu placerat felis.
                    <br />
                    <br />
                    Lorem ipsum dolor sit amet, consectetur...
                </div>

                {/* Checkbox */}
                <div className='flex items-center space-x-2'>
                    <input
                        type='checkbox'
                        id='accept-terms'
                        checked={isAccepted}
                        onChange={(e) => setIsAccepted(e.target.checked)}
                        className='w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <label htmlFor='accept-terms' className='text-sm text-gray-800'>
                        J'ai lu et j'accepte les conditions générales
                    </label>
                </div>
            </div>

            {/* Bouton bas */}
            <div className='w-full max-w-md mx-auto px-2 pb-10 mt-8'>
                <Button
                    onClick={handleNext}
                    disabled={!isAccepted}
                    className={`w-full py-3 rounded-full text-base font-semibold text-center transition ${
                        isAccepted
                            ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Accéder à Elios
                </Button>
            </div>
        </div>
    );
};

export default TermsAndConditions;
