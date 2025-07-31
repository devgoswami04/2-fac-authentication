
import api from '../api';

export default function Dashboard({ setStage }) {
  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    setStage('login');
  };

  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-bold">Welcome to Dashboard 🎉</h1>
      <button className="btn-indigo" onClick={logout}>Logout</button>
    </div>
  );
}
