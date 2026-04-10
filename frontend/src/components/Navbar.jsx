import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow">
      <span className="font-bold text-lg tracking-wide">LiVrai</span>
      <div className="flex items-center gap-4 text-sm">
        <button onClick={() => navigate('/')} className="hover:underline">
          Accueil
        </button>
        {user.role === 'admin' && (
          <button onClick={() => navigate('/clients')} className="hover:underline">
            Clients
          </button>
        )}
        <button onClick={() => navigate('/livraisons')} className="hover:underline">
          Livraisons
        </button>
        {user.role === 'client' && (
          <button onClick={() => navigate('/commande')} className="hover:underline">
            Passer commande
          </button>
        )}
        <button
          onClick={logout}
          className="ml-2 bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
