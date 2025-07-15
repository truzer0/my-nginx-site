"use client";

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Settings,
  Users,
  FileText,
  Image,
  Download,
  ChevronLeft,
  Circle,
  ThumbsUp,
  Heart,
  Laugh
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  fileName?: string;
  fileSize?: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  type: 'direct' | 'group';
  participants?: string[];
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isOnline: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/32/32',
    lastMessage: 'The Q4 report is ready for review',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    isOnline: true,
    type: 'direct'
  },
  {
    id: '2',
    name: 'Marketing Team',
    avatar: '/api/placeholder/32/32',
    lastMessage: 'Alex: Updated the campaign assets',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    unreadCount: 5,
    isOnline: false,
    type: 'group',
    participants: ['alex', 'maria', 'john', 'sarah']
  }
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      senderId: 'sarah',
      senderName: 'Sarah Johnson',
      senderAvatar: '/api/placeholder/32/32',
      content: 'Hi! I wanted to update you on the Q4 financial report progress.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'm2',
      senderId: 'me',
      senderName: 'You',
      senderAvatar: '/api/placeholder/32/32',
      content: 'Great! How is it looking so far?',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: 'text'
    }
  ]
};

const mockParticipants: Participant[] = [
  {
    id: 'sarah',
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/32/32',
    role: 'Senior Financial Analyst',
    isOnline: true
  }
];

export default function MessengerInterface() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [message, setMessage] = useState('');
  const [showDetails, setShowDetails] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setMessage('');
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = mockMessages[selectedConversation] || [];
  const currentConversation = mockConversations.find(c => c.id === selectedConversation);

  return (
    <div className="flex h-screen bg-background">
      {/* Conversations List */}
      <div className="w-80 bg-surface border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input border-border"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation === conversation.id
                    ? 'bg-accent/10 border border-accent/20'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage 
                      src={conversation.avatar} 
                      alt={`Avatar of ${conversation.name}`}
                    />
                    <AvatarFallback className="bg-muted text-foreground text-sm">
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <Circle className="absolute -bottom-1 -right-1 w-4 h-4 fill-green-500 text-green-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground truncate">
                      {conversation.name}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conversation.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                </div>

                {conversation.unreadCount > 0 && (
                  <Badge className="bg-accent text-accent-foreground text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={currentConversation?.avatar} 
                alt={`Avatar of ${currentConversation?.name}`}
              />
              <AvatarFallback className="bg-muted text-foreground">
                {currentConversation?.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-foreground">{currentConversation?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {currentConversation?.isOnline ? 'Active now' : 'Last seen recently'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className={showDetails ? 'bg-accent/10' : ''}
            >
              <Users className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.senderId === 'me' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarImage 
                    src={msg.senderAvatar} 
                    alt={`Avatar of ${msg.senderName}`}
                  />
                  <AvatarFallback className="bg-muted text-foreground text-xs">
                    {msg.senderName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex flex-col gap-1 max-w-[70%] ${msg.senderId === 'me' ? 'items-end' : ''}`}>
                  {msg.senderId !== 'me' && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {msg.senderName}
                    </span>
                  )}

                  <div
                    className={`rounded-lg px-4 py-2 ${
                      msg.senderId === 'me'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-surface border border-border text-foreground'
                    }`}
                  >
                    {msg.type === 'file' ? (
                      <div className="flex items-center gap-2 min-w-[200px]">
                        <FileText className="w-8 h-8 flex-shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{msg.fileName}</p>
                          <p className="text-xs opacity-70">{msg.fileSize}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="flex-shrink-0">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-muted text-foreground text-xs">
                    {currentConversation?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-surface border border-border rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-surface">
          <div className="flex items-end gap-3">
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </Button>

            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-input border-border pr-10"
              />
              <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <Smile className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
