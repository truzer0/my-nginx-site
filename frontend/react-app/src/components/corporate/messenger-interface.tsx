"use client"

import { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
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
} from 'lucide-react'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  type: 'text' | 'file' | 'image'
  fileName?: string
  fileSize?: string
  reactions?: { emoji: string; count: number; users: string[] }[]
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline: boolean
  type: 'direct' | 'group'
  participants?: string[]
}

interface Participant {
  id: string
  name: string
  avatar: string
  role: string
  isOnline: boolean
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
  },
  {
    id: '3',
    name: 'David Chen',
    avatar: '/api/placeholder/32/32',
    lastMessage: 'Meeting moved to 3 PM tomorrow',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    isOnline: true,
    type: 'direct'
  },
  {
    id: '4',
    name: 'Project Alpha',
    avatar: '/api/placeholder/32/32',
    lastMessage: 'Lisa: Code review completed ✅',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    unreadCount: 1,
    isOnline: false,
    type: 'group'
  }
]

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
    },
    {
      id: 'm3',
      senderId: 'sarah',
      senderName: 'Sarah Johnson',
      senderAvatar: '/api/placeholder/32/32',
      content: 'Q4_Financial_Report_Draft.xlsx',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'file',
      fileName: 'Q4_Financial_Report_Draft.xlsx',
      fileSize: '2.4 MB'
    },
    {
      id: 'm4',
      senderId: 'sarah',
      senderName: 'Sarah Johnson',
      senderAvatar: '/api/placeholder/32/32',
      content: 'The Q4 report is ready for review',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
      reactions: [
        { emoji: '👍', count: 1, users: ['me'] }
      ]
    }
  ],
  '2': [
    {
      id: 'm5',
      senderId: 'alex',
      senderName: 'Alex Rodriguez',
      senderAvatar: '/api/placeholder/32/32',
      content: 'Team, I\'ve updated all the campaign assets with the new brand guidelines.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'm6',
      senderId: 'maria',
      senderName: 'Maria Garcia',
      senderAvatar: '/api/placeholder/32/32',
      content: 'Perfect timing! The client review is tomorrow.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'text'
    },
    {
      id: 'm7',
      senderId: 'alex',
      senderName: 'Alex Rodriguez',
      senderAvatar: '/api/placeholder/32/32',
      content: 'Updated the campaign assets',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'text'
    }
  ]
}

const mockParticipants: Participant[] = [
  {
    id: 'sarah',
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/32/32',
    role: 'Senior Financial Analyst',
    isOnline: true
  },
  {
    id: 'alex',
    name: 'Alex Rodriguez',
    avatar: '/api/placeholder/32/32',
    role: 'Marketing Manager',
    isOnline: true
  },
  {
    id: 'maria',
    name: 'Maria Garcia',
    avatar: '/api/placeholder/32/32',
    role: 'Creative Director',
    isOnline: false
  }
]

export default function MessengerInterface() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1')
  const [message, setMessage] = useState('')
  const [showDetails, setShowDetails] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation])

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    // Simulate sending message
    setMessage('')
    
    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatLastMessageTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60 * 60 * 1000) { // Less than 1 hour
      return Math.floor(diff / (60 * 1000)) + 'm'
    } else if (diff < 24 * 60 * 60 * 1000) { // Less than 24 hours
      return Math.floor(diff / (60 * 60 * 1000)) + 'h'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentMessages = mockMessages[selectedConversation] || []
  const currentConversation = mockConversations.find(c => c.id === selectedConversation)

  return (
    <div className="flex h-screen bg-background">
      {/* Conversations List */}
      <div className="w-80 bg-surface border-r border-border flex flex-col">
        {/* Search Header */}
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

        {/* Conversations */}
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
                    <AvatarImage src={conversation.avatar} />
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
                      {formatLastMessageTime(conversation.timestamp)}
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
              <AvatarImage src={currentConversation?.avatar} />
              <AvatarFallback className="bg-muted text-foreground">
                {currentConversation?.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-foreground">{currentConversation?.name}</h3>
              {currentConversation?.type === 'group' ? (
                <p className="text-sm text-muted-foreground">
                  {currentConversation.participants?.length} participants
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {currentConversation?.isOnline ? 'Active now' : 'Last seen recently'}
                </p>
              )}
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
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
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
                  <AvatarImage src={msg.senderAvatar} />
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
                    
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex gap-1">
                        {msg.reactions.map((reaction, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-surface border border-border rounded-full px-1.5 py-0.5 flex items-center gap-1"
                          >
                            {reaction.emoji} {reaction.count}
                          </span>
                        ))}
                      </div>
                    )}
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                    <Smile className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="grid grid-cols-8 gap-2">
                    {['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '❤️', '🎉', '🔥', '💯', '✨'].map((emoji) => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        onClick={() => setMessage(message + emoji)}
                        className="h-8 w-8 p-0"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
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

      {/* Chat Details Panel */}
      {showDetails && (
        <div className="w-80 bg-surface border-l border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium text-foreground">Chat Details</h3>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Participants */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Participants</h4>
                <div className="space-y-2">
                  {mockParticipants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback className="bg-muted text-foreground text-xs">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {participant.isOnline && (
                          <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-green-500 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {participant.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {participant.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shared Files */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Shared Files</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        Q4_Financial_Report_Draft.xlsx
                      </p>
                      <p className="text-xs text-muted-foreground">2.4 MB • 2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border">
                    <Image className="w-6 h-6 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        campaign_mockup.png
                      </p>
                      <p className="text-xs text-muted-foreground">1.8 MB • Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Settings</h4>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Chat Settings
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
                    Leave Conversation
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}