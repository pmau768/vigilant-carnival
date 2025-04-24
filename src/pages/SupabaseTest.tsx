import { useSession } from '../context/AuthContext';
import { LoginForm } from '../components/ui/LoginForm';
import { PetForm } from '../components/pet/PetForm';
import { DebugPanel } from '../components/ui/DebugPanel';

export const SupabaseTest = () => {
  const { userId } = useSession();

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Supabase Integration Test</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
        <LoginForm />
      </div>
      
      {userId ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pet Management</h2>
          <PetForm />
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

export default SupabaseTest; 