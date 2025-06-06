import ActionButtons from '@/components/rewards/ActionButtons';
import CopyAlert from '@/components/rewards/CopyAlert';
import EliCoinsCard from '@/components/rewards/EliCoinsCard';
import ReferralSection from '@/components/rewards/ReferralSection';
import RewardsSection from '@/components/rewards/RewardsSection';
import PageLayout from '@/layout/PageLayout';
// src/pages/Rewards.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Rewards = () => {
    const _navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard
            .writeText('elios.me/username-id')
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => console.error('Erreur de copie:', err));
    };

    return (
        <PageLayout title='Récompenses'>
            {copied && <CopyAlert />}

            <h3 className='mb-4 text-lg font-bold'>Parrainez vos amis &amp; gagnez 100 points</h3>
            <ReferralSection onCopy={handleCopy} />

            <EliCoinsCard coins={125} totalCoins={500} />
            <ActionButtons />
            <RewardsSection />
        </PageLayout>
    );
};

export default Rewards;
