import { useSession } from '../context/AuthContext';
import { LoginForm } from '../components/ui/LoginForm';
import { PetFormWithQuery } from '../components/pet/PetFormWithQuery';
import { DebugPanel } from '../components/ui/DebugPanel';

export const ReactQueryTest = () => {
  const { userId } = useSession();

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-6">React Query + Supabase Integration</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
        <LoginForm />
      </div>
      
      {userId ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pet Management with React Query</h2>
          <p className="mb-4 text-gray-600">
            This version uses React Query for improved data fetching with automatic caching, 
            background refreshes, and optimistic updates.
          </p>
          <PetFormWithQuery />
        </div>
      ) : (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p>Please log in to manage your pets.</p>
        </div>
      )}
      
      <DebugPanel />
    </div>
  );
};

export default ReactQueryTest; 