import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  Send, 
  Users, 
  MoreVertical,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { mockChatRooms, getCurrentUser, mockUsers, type Message } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface ChatRoomProps {
  roomId: string;
  onBack: () => void;
}

const ChatRoom = ({ roomId, onBack }: ChatRoomProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = getCurrentUser();
  const { toast } = useToast();

  const room = mockChatRooms.find(r => r.id === roomId);
  
  // Mock messages for demo
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hey everyone! Welcome to our chat room!',
        senderId: '2',
        senderName: 'Dr. Sarah Smith',
        timestamp: '2 hours ago',
        roomId: roomId
      },
      {
        id: '2',
        content: 'Thanks for creating this space! Looking forward to collaborating.',
        senderId: '3',
        senderName: 'Alex Johnson',
        timestamp: '1 hour ago',
        roomId: roomId
      },
      {
        id: '3',
        content: 'Has anyone started working on the upcoming project? I\'d love to form a team!',
        senderId: '3',
        senderName: 'Alex Johnson',
        timestamp: '45 minutes ago',
        roomId: roomId
      },
      {
        id: '4',
        content: 'Great idea! I\'m interested in joining. What technology stack are we using?',
        senderId: '2',
        senderName: 'Dr. Sarah Smith',
        timestamp: '30 minutes ago',
        roomId: roomId
      }
    ];
    setMessages(mockMessages);
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!room || !user) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Chat room not found or access denied.</p>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    
    // Simulate AI moderation
    const containsInappropriateContent = message.toLowerCase().includes('spam') || 
                                       message.toLowerCase().includes('inappropriate');

    if (containsInappropriateContent) {
      toast({
        title: "Message Flagged",
        description: "Your message has been flagged for review by AI moderation",
        variant: "destructive"
      });
      setIsLoading(false);
      setMessage('');
      return;
    }

    const newMessage: Message = {
      id: Math.random().toString(36),
      content: message,
      senderId: user.id,
      senderName: user.name,
      timestamp: 'now',
      roomId: roomId
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsLoading(false);

    toast({
      title: "Message sent!",
      description: "Your message has been posted to the chat",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <CardTitle className="text-xl">{room.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {room.memberCount} members
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    AI Moderated
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <ScrollArea className="h-96 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.senderId === user.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.senderId !== user.id && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={mockUsers.find(u => u.id === msg.senderId)?.profilePic} 
                        alt={msg.senderName} 
                      />
                      <AvatarFallback>{msg.senderName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-xs md:max-w-md ${msg.senderId === user.id ? 'order-first' : ''}`}>
                    {msg.senderId !== user.id && (
                      <p className="text-xs text-muted-foreground mb-1">{msg.senderName}</p>
                    )}
                    <div
                      className={`p-3 rounded-lg ${
                        msg.senderId === user.id
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.senderId === user.id 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>

                  {msg.senderId === user.id && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.profilePic} alt={user.name} />
                      <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              className="btn-cosmic"
              disabled={isLoading || !message.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>All messages are monitored by AI for safety</span>
          </div>
        </CardContent>
      </Card>

      {/* Room Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Room Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created by</p>
              <p className="font-medium">{room.createdBy}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Members</p>
              <p className="font-medium">{room.memberCount} active</p>
            </div>
          </div>
          
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4" />
              <span>This chat room follows community guidelines and is AI-moderated</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatRoom;