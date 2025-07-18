"use client"

import { useState, useEffect, useRef } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Users,
  ChevronLeft,
  Circle,
  Loader2
} from 'lucide-react'

interface Message {
  id: string
  sender_id: string
  sender_name: string
  sender_avatar: string
  content: string
  created_at: string
  is_current_user: boolean
}

interface Conversation {
  user_id: string
  name: string
  last_name: string
  profile_image: string
  last_message: string
  last_message_time: string
  unread_count: number
  is_online: boolean
}

interface User {
  id: string
  name: string
  last_name: string
  profile_image: string
  is_online: boolean
}

export default function MessengerInterface() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentChatPartner, setCurrentChatPartner] = useState<{
    id: string
    name: string
    avatar: string
  } | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeView, setActiveView] = useState<'conversations' | 'chat' | 'users'>('conversations')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Загрузка списка диалогов
  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to load conversations')
      
      const data = await response.json()
      setConversations(data)
    } catch (err) {
      console.error('Error loading conversations:', err)
      setError(err instanceof Error ? err.message : 'Failed to load conversations')
      toast({
        title: "Error loading conversations",
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Загрузка доступных пользователей
  const loadAvailableUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/users/available', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to load users')
      
      const data = await response.json()
      setAvailableUsers(data)
    } catch (err) {
      console.error('Error loading users:', err)
      setError(err instanceof Error ? err.message : 'Failed to load users')
    }
  }

  // Загрузка сообщений
  const loadMessages = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to load messages')
      
      const data = await response.json()
      setMessages(data)
      
      // Пометка сообщений как прочитанных
      await fetch(`/api/messages/${userId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      setTimeout(scrollToBottom, 100)
    } catch (err) {
      console.error('Error loading messages:', err)
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    }
  }

  // Проверка непрочитанных сообщений
  const checkUnreadMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/conversations/unread', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.total_unread || 0)
      }
    } catch (err) {
      console.error('Error checking unread messages:', err)
    }
  }

  // Отправка сообщения
  const sendMessage = async () => {
    if (!messageInput.trim() || !currentChatPartner) return
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipient_id: currentChatPartner.id,
          content: messageInput
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to send message')
      }

      setMessageInput('')
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 2000)
      await loadMessages(currentChatPartner.id)
    } catch (err) {
      console.error('Error sending message:', err)
      toast({
        title: "Error sending message",
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: "destructive"
      })
    }
  }

  // Открытие чата с пользователем
  const openChat = (userId: string, userName: string, userAvatar: string) => {
    setCurrentChatPartner({
      id: userId,
      name: userName,
      avatar: userAvatar
    })
    setActiveView('chat')
    loadMessages(userId)
  }

  // Начать автоматическое обновление
  const startRefreshing = () => {
    refreshIntervalRef.current = setInterval(() => {
      if (currentChatPartner) {
        loadMessages(currentChatPartner.id)
      } else {
        loadConversations()
      }
      checkUnreadMessages()
    }, 5000)
  }

  // Остановить автоматическое обновление
  const stopRefreshing = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
    }
  }

  useEffect(() => {
    loadConversations()
    checkUnreadMessages()
    startRefreshing()

    return () => {
      stopRefreshing()
    }
  }, [])

  useEffect(() => {
    if (activeView === 'users') {
      loadAvailableUsers()
    }
  }, [activeView])

  if (loading && !conversations.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadConversations}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Боковая панель с диалогами/пользователями */}
      <div className={`w-80 bg-surface border-r border-border flex flex-col ${activeView === 'chat' ? 'hidden md:flex' : ''}`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {activeView === 'users' ? 'Users' : 'Messages'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView(activeView === 'users' ? 'conversations' : 'users')}
            >
              {activeView === 'users' ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <Users className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeView === 'users' ? 'users' : 'conversations'}...`}
              className="pl-9 bg-input border-border"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {activeView === 'conversations' ? (
              conversations.map((conversation) => (
                <div
                  key={conversation.user_id}
                  onClick={() => openChat(
                    conversation.user_id,
                    `${conversation.name} ${conversation.last_name || ''}`,
                    conversation.profile_image
                  )}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={conversation.profile_image || '/default-avatar.jpg'}
                        alt={`${conversation.name}'s avatar`}
                      />
                      <AvatarFallback>
                        {conversation.name.charAt(0)}{(conversation.last_name || '').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.is_online && (
                      <Circle className="absolute -bottom-1 -right-1 w-4 h-4 fill-green-500 text-green-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground truncate">
                        {conversation.name} {conversation.last_name}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(conversation.last_message_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.last_message}
                    </p>
                  </div>

                  {conversation.unread_count > 0 && (
                    <Badge className="ml-2">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              availableUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token')
                      if (!token) return

                      // Проверяем возможность начать диалог
                      const checkResponse = await fetch(`/api/conversations/check/${user.id}`, {
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      })
                      
                      if (checkResponse.ok) {
                        const checkData = await checkResponse.json()
                        if (checkData.canSend) {
                          openChat(
                            user.id,
                            `${user.name} ${user.last_name || ''}`,
                            user.profile_image
                          )
                        } else {
                          toast({
                            title: "Cannot start conversation",
                            description: "You don't have permission to message this user",
                            variant: "destructive"
                          })
                        }
                      }
                    } catch (err) {
                      console.error('Error checking conversation:', err)
                    }
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50"
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={user.profile_image || '/default-avatar.jpg'}
                        alt={`${user.name}'s avatar`}
                      />
                      <AvatarFallback>
                        {user.name.charAt(0)}{(user.last_name || '').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {user.is_online && (
                      <Circle className="absolute -bottom-1 -right-1 w-4 h-4 fill-green-500 text-green-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {user.name} {user.last_name}
                    </h4>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Область чата */}
      {activeView === 'chat' && currentChatPartner ? (
        <div className="flex-1 flex flex-col bg-background">
          {/* Заголовок чата */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setActiveView('conversations')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={currentChatPartner.avatar || '/default-avatar.jpg'}
                  alt={`${currentChatPartner.name}'s avatar`}
                />
                <AvatarFallback>
                  {currentChatPartner.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-medium text-foreground">{currentChatPartner.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {isTyping ? 'Typing...' : 'Online'}
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
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Сообщения */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.is_current_user ? 'flex-row-reverse' : ''}`}
                >
                  {!message.is_current_user && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarImage
                        src={message.sender_avatar || '/default-avatar.jpg'}
                        alt={`${message.sender_name}'s avatar`}
                      />
                      <AvatarFallback>
                        {message.sender_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`flex flex-col gap-1 max-w-[70%] ${message.is_current_user ? 'items-end' : ''}`}>
                    {!message.is_current_user && (
                      <span className="text-xs text-muted-foreground font-medium">
                        {message.sender_name}
                      </span>
                    )}

                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.is_current_user
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface border border-border text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarImage
                      src={currentChatPartner.avatar || '/default-avatar.jpg'}
                      alt={`${currentChatPartner.name}'s avatar`}
                    />
                    <AvatarFallback>
                      {currentChatPartner.name.split(' ').map(n => n[0]).join('')}
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

          {/* Ввод сообщения */}
          <div className="p-4 border-t border-border bg-surface">
            <div className="flex items-end gap-3">
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <Paperclip className="w-4 h-4" />
              </Button>

              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="bg-input border-border pr-10"
                />
              </div>

              <Button
                onClick={sendMessage}
                disabled={!messageInput.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              {activeView === 'users' ? 'Select a user to chat with' : 'Select a conversation'}
            </h3>
            <p className="text-muted-foreground">
              {activeView === 'users' 
                ? 'Start a new conversation by selecting a user' 
                : 'Choose an existing conversation from the list'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
