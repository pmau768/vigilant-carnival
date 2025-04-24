import { useState } from 'react';
import { signIn, signUp, signOut } from '../../services';
import { useSession } from '../../context/AuthContext';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { userId } = useSession();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      setMessage('Signed in successfully!');
    } catch (error: any) {
      setMessage(`Error signing in: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      setMessage('Signed up successfully! Check your email for confirmation.');
    } catch (error: any) {
      setMessage(`Error signing up: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setMessage('Signed out successfully!');
    } catch (error: any) {
      setMessage(`Error signing out: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (userId) {
    return (
      <div className="p-4 border rounded-lg shadow-sm">
        <p className="mb-4">Logged in as user ID: <span className="font-mono text-sm">{userId}</span></p>
        <button 
          onClick={handleSignOut}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? 'Signing out...' : 'Sign Out'}
        </button>
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    );
  }

  return (
    <form className="p-4 border rounded-lg shadow-sm">
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          onClick={handleSignIn}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={handleSignUp}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </div>
      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </form>
  );
}; 