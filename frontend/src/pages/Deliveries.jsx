import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const STATUS_BADGE = {
  'En attente': 'bg-yellow-100 text-yellow-800',
  'Acceptée': 'bg-blue-100 text-blue-800',
  'Refusée': 'bg-red-100 text-red-800',
  'Terminée': 'bg-green-100 text-green-800',
};

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const load = () => {
    axios
      .get('/api/deliveries', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setDeliveries(r.data));
  };

  useEffect(() => {
    load();
  }, []);

  const updateDelivery = async (id, status, price = null) => {
    await axios.put(
      `/api/deliveries/${id}`,
      { status, price },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    load();
  };

  const ongoing = deliveries.filter((d) => ['En attente', 'Acceptée'].includes(d.status));
  const past = deliveries.filter((d) => ['Refusée', 'Terminée'].includes(d.status));

  const colSpan = user.role === 'admin' ? 6 : 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Livraisons</h1>

        <h2 className="text-lg font-semibold mb-3">En cours</h2>
        <div className="bg-white rounded shadow overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                {user.role === 'admin' && (
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
                )}
                <th className="text-left px-4 py-3 font-medium text-gray-600">Volume</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Poids</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
                {user.role === 'admin' && (
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {ongoing.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{d.id}</td>
                  {user.role === 'admin' && <td className="px-4 py-3 font-medium">{d.clientName}</td>}
                  <td className="px-4 py-3">{d.volume} m³</td>
                  <td className="px-4 py-3">{d.weight} kg</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_BADGE[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                  {user.role === 'admin' && (
                    <td className="px-4 py-3 space-x-2">
                      {d.status === 'En attente' && (
                        <>
                          <button
                            onClick={() => updateDelivery(d.id, 'Acceptée')}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => updateDelivery(d.id, 'Refusée')}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                          >
                            Refuser
                          </button>
                        </>
                      )}
                      {d.status === 'Acceptée' && (
                        <button
                          onClick={() => {
                            const price = prompt('Prix de facturation (€) :');
                            if (price) updateDelivery(d.id, 'Terminée', parseFloat(price));
                          }}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                        >
                          Facturer
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {ongoing.length === 0 && (
                <tr>
                  <td colSpan={colSpan} className="px-4 py-6 text-center text-gray-400">
                    Aucune livraison en cours
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-semibold mb-3">Passées</h2>
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                {user.role === 'admin' && (
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
                )}
                <th className="text-left px-4 py-3 font-medium text-gray-600">Volume</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Poids</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Prix</th>
              </tr>
            </thead>
            <tbody>
              {past.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{d.id}</td>
                  {user.role === 'admin' && <td className="px-4 py-3 font-medium">{d.clientName}</td>}
                  <td className="px-4 py-3">{d.volume} m³</td>
                  <td className="px-4 py-3">{d.weight} kg</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_BADGE[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{d.price ? `${d.price} €` : '—'}</td>
                </tr>
              ))}
              {past.length === 0 && (
                <tr>
                  <td colSpan={colSpan + 1} className="px-4 py-6 text-center text-gray-400">
                    Aucune livraison passée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
