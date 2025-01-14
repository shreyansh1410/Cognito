import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Share2, Plus, LogOut } from 'lucide-react';
import { logout } from '../store/authSlice';
import { RootState } from '../store';

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleShareBrain = () => {
    // Implement share brain functionality
    console.log('Share brain clicked');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  };

  return (
    <header className="border-b bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">All Notes</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleShareBrain}>
            <Share2 className="h-4 w-4" />
            Share Brain
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Content
          </Button>
          <Button variant="ghost" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout {user?.email}
          </Button>
        </div>
      </div>
    </header>
  );
}

