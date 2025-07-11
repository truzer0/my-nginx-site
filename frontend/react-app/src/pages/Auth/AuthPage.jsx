import { useState } from 'react';
import { GradientBg, GlassCard } from '../../components/UI';
import { LoginForm, ADLoginForm, FirstLoginForm } from '../../components/Auth';

export const AuthPage = () => {
  const [step, setStep] = useState('login');
  const [username, setUsername] = useState('');
  const [needsRegistration, setNeedsRegistration] = useState(false);

  return (
    <GradientBg>
      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <GlassCard className="w-full max-w-md p-8">
          {step === 'login' && (
            <LoginForm 
              onSuccess={(uname, exists) => {
                setUsername(uname);
                setStep(exists ? 'db-login' : 'ad-login');
              }} 
            />
          )}
          
          {step === 'ad-login' && !needsRegistration && (
            <ADLoginForm 
              username={username}
              onSuccess={(data) => {
                if (data.firstLogin) {
                  setNeedsRegistration(true);
                } else {
                  window.location.href = '/';
                }
              }}
            />
          )}
          
          {needsRegistration && (
            <FirstLoginForm 
              username={username}
              onComplete={() => {
                setNeedsRegistration(false);
                window.location.href = '/';
              }}
            />
          )}
        </GlassCard>
      </div>
    </GradientBg>
  );
};
