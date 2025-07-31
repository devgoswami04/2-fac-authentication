import { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Setup2FA from './components/Setup2FA';
import Verify2FA from './components/Verify2FA';
import Dashboard from './components/Dashboard';

export default function App() {
  const [stage, setStage] = useState('register'); // 'login', 'setup', 'verify', 'dashboard'
  const [user, setUser] = useState('');

  const props = { onNext: setStage, setUser };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md space-y-4">
        {stage === 'register' && <RegisterForm {...props} />}
        {stage === 'login' && <LoginForm {...props} />}
        {stage === 'setup' && <Setup2FA onNext={setStage} />}
        {stage === 'verify' && <Verify2FA onNext={setStage} />}
        {stage === 'dashboard' && <Dashboard setStage={setStage} />}
      </div>
    </div>
  );
}
