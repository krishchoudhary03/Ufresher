import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building, 
  Users, 
  MessageCircle, 
  Search, 
  Plus, 
  Star,
  UserPlus,
  MessageSquare
} from 'lucide-react';
import { mockCommunities, mockClubs, mockChatRooms, getCurrentUser } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface CommunitiesProps {
  onOpenChat: (roomId: string) => void;
}

const Communities = ({ onOpenChat }: CommunitiesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'communities' | 'clubs' | 'mentors' | 'chats'>('communities');
  const user = getCurrentUser();
  const { toast } = useToast();

  const filteredCommunities = mockCommunities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const joinCommunity = (communityId: string) => {
    if (user) {
      user.joinedCommunities.push(communityId);
      toast({
        title: "Joined Community!",
        description: "You've successfully joined the community",
      });
    }
  };

  const leaveCommunity = (communityId: string) => {
    if (user) {
      const index = user.joinedCommunities.indexOf(communityId);
      if (index > -1) {
        user.joinedCommunities.splice(index, 1);
        toast({
          title: "Left Community",
          description: "You've left the community",
          variant: "destructive"
        });
      }
    }
  };

  const renderCommunities = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredCommunities.map((community) => {
        const isJoined = user?.joinedCommunities.includes(community.id);
        
        return (
          <Card key={community.id} className="glass-card hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{community.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4" />
                      {community.memberCount} members
                    </CardDescription>
                  </div>
                </div>
                {isJoined && (
                  <Badge variant="default" className="bg-success">
                    <Star className="w-3 h-3 mr-1" />
                    Joined
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{community.description}</p>
              <div className="flex gap-2">
                {isJoined ? (
                  <>
                    <Button 
                      onClick={() => setSelectedCommunity(community.id)}
                      className="btn-cosmic flex-1"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Explore
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => leaveCommunity(community.id)}
                      className="text-destructive"
                    >
                      Leave
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => joinCommunity(community.id)}
                    className="w-full btn-cosmic"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Community
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderCommunityDetails = () => {
    const community = mockCommunities.find(c => c.id === selectedCommunity);
    if (!community) return null;

    const communityClubs = mockClubs.filter(club => club.communityId === community.id);
    const communityChatRooms = mockChatRooms.filter(room => room.communityId === community.id);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCommunity(null)}
              className="mb-2"
            >
              ← Back to Communities
            </Button>
            <h2 className="text-3xl font-bold gradient-text">{community.name}</h2>
            <p className="text-muted-foreground">{community.description}</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            <Users className="w-4 h-4 mr-1" />
            {community.memberCount} members
          </Badge>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'clubs' ? 'default' : 'outline'}
            onClick={() => setActiveTab('clubs')}
          >
            Clubs ({communityClubs.length})
          </Button>
          <Button
            variant={activeTab === 'chats' ? 'default' : 'outline'}
            onClick={() => setActiveTab('chats')}
          >
            Chat Rooms ({communityChatRooms.length})
          </Button>
          <Button
            variant={activeTab === 'mentors' ? 'default' : 'outline'}
            onClick={() => setActiveTab('mentors')}
          >
            Mentors
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'clubs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityClubs.map((club) => (
              <Card key={club.id} className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">{club.name}</CardTitle>
                  <CardDescription>{club.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-muted-foreground">
                      <strong>Club Head:</strong> {club.clubHead}
                    </div>
                    <Badge variant="secondary">{club.memberCount} members</Badge>
                  </div>
                  <Button className="w-full btn-cosmic">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Club
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="space-y-4">
            {communityChatRooms.map((room) => (
              <Card key={room.id} className="glass-card hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => onOpenChat(room.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{room.name}</h4>
                        <p className="text-sm text-muted-foreground">{room.lastMessage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {room.memberCount} members
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {room.lastMessageTime}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {user?.role === 'junior' && (
              <Card className="glass-card border-dashed border-primary/50">
                <CardContent className="p-6 text-center">
                  <Plus className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Create New Chat Room</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start a new discussion topic for the community
                  </p>
                  <Button className="btn-cosmic">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Chat Room
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mock mentors for demo */}
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12 avatar-glow">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=mentor1" />
                    <AvatarFallback>DS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Dr. Sarah Smith</h4>
                    <p className="text-sm text-muted-foreground">Computer Science</p>
                    <Badge variant="outline" className="text-xs text-success mt-1">
                      Available for Mentorship
                    </Badge>
                  </div>
                </div>
                <Button className="w-full btn-cosmic">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Request Mentorship
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {!selectedCommunity ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Communities</h1>
              <p className="text-muted-foreground">Discover and join college communities</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {renderCommunities()}
        </>
      ) : (
        renderCommunityDetails()
      )}
    </div>
  );
};

export default Communities;