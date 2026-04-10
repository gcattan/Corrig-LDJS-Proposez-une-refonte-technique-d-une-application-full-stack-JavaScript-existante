import Navbar from '../components/Navbar';

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-2">Bienvenue, {user.name}</h1>
        <p className="text-gray-500">
          Rôle : <span className="font-medium capitalize">{user.role}</span>
        </p>
      </div>
    </div>
  );
}
