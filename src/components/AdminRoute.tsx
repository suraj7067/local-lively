
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      // If not logged in, redirect to auth page
      if (!user) {
        navigate('/auth', { replace: true });
        return;
      }
      
      // If logged in but not admin, redirect to home
      if (!isAdmin) {
        toast({
          variant: "destructive",
          title: "Unauthorized access",
          description: "This area is restricted to administrators only.",
        });
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;
