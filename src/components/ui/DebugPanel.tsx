import { useState } from 'react';
import { supabase } from '../../services';

export const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const testSupabaseConnection = async () => {
    try {
      setTestResult('Testing...');
      const { data, error } = await supabase.from('pets').select('count()');
      
      if (error) {
        setTestResult(`Error: ${error.message} (${error.code})`);
        return;
      }
      
      setTestResult(`Success! Database connection works. Count: ${JSON.stringify(data)}`);
    } catch (err: any) {
      setTestResult(`Exception: ${err.message}`);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-md text-sm"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 bg-gray-800 text-white p-4 rounded-t-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Debug Panel</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Environment Variables:</h4>
          <div className="bg-gray-700 p-2 rounded text-xs font-mono">
            <div>SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</div>
            <div>SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '***' : 'Not set'}</div>
          </div>
        </div>

        <div>
          <button
            onClick={testSupabaseConnection}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
          >
            Test Supabase Connection
          </button>
          
          {testResult && (
            <div className="mt-2 bg-gray-700 p-2 rounded text-xs font-mono">
              {testResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 