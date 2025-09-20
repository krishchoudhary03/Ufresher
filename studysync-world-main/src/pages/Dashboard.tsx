import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageCircle, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Heart,
  Building,
  Crown,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';
import { mockCommunities, mockClubs, mockChatRooms } from '@/lib/mockData';
import { useAuth } from '@/hooks/useAuth';
import Communities from './Communities';
import Profile from './Profile';
import ChatRoom from './ChatRoom';
import AdminPanel from './AdminPanel';

interface DashboardProps {
  onLogout: () => void;
}

type ActiveView = 'dashboard' | 'communities' | 'profile' | 'chat' | 'admin';

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedChatRoom, setSelectedChatRoom] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const handleOpenChat = (roomId: string) => {
    setSelectedChatRoom(roomId);
    setActiveView('chat');
  };

  const renderNavigation = () => (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 avatar-glow">
            <AvatarImage src={user.profile_pic} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant={user.role === 'admin' ? 'destructive' : user.role === 'mentor' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {user.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                {user.role === 'mentor' && <Star className="w-3 h-3 mr-1" />}
                {user.role}
              </Badge>
              {user.role === 'mentor' && user.available_for_mentorship && (
                <Badge variant="outline" className="text-xs text-success">
                  Available for Mentorship
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant={activeView === 'dashboard' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveView('dashboard')}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <Button
          variant={activeView === 'communities' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveView('communities')}
        >
          <Building className="w-4 h-4 mr-2" />
          Communities
        </Button>
        <Button
          variant={activeView === 'profile' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveView('profile')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Profile
        </Button>
        {user.role === 'admin' && (
          <Button
            variant={activeView === 'admin' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveView('admin')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Panel
          </Button>
        )}
        <div className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold gradient-text">
          Welcome back to U-fresher
        </h1>
        <Heart className="w-8 h-8 text-accent" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communities Joined</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{user.joined_communities.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clubs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{user.joined_clubs.length}</div>
            <p className="text-xs text-muted-foreground">
              +1 this week
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user.role === 'mentor' ? 'Mentees' : 'Mentors'}
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{user.connected_mentors.length}</div>
            <p className="text-xs text-muted-foreground">
              Active connections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest interactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockChatRooms.slice(0, 3).map((room) => (
              <div key={room.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{room.name}</p>
                    <p className="text-sm text-muted-foreground">{room.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{room.lastMessageTime}</p>
                  <Badge variant="secondary" className="text-xs">
                    {room.memberCount} members
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => setActiveView('communities')}
              className="btn-cosmic h-auto p-4 flex-col gap-2"
            >
              <Building className="w-6 h-6" />
              <span>Explore Communities</span>
            </Button>
            <Button 
              onClick={() => setActiveView('profile')}
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
            >
              <Settings className="w-6 h-6" />
              <span>Update Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'communities':
        return <Communities onOpenChat={handleOpenChat} />;
      case 'profile':
        return <Profile />;
      case 'chat':
        return selectedChatRoom ? (
          <ChatRoom 
            roomId={selectedChatRoom} 
            onBack={() => setActiveView('communities')} 
          />
        ) : null;
      case 'admin':
        return user.role === 'admin' ? <AdminPanel /> : renderDashboardOverview();
      default:
        return renderDashboardOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {renderNavigation()}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;