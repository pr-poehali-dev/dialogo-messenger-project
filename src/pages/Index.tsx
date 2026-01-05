import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: number;
  text?: string;
  time: string;
  sender: 'me' | 'other';
  reactions?: string[];
  type?: 'text' | 'voice' | 'video';
  duration?: string;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
}

const mockChats: Chat[] = [
  { id: 1, name: 'Алиса Петрова', avatar: '', lastMessage: 'Привет! Как дела?', time: '14:32', unread: 3, online: true },
  { id: 2, name: 'Команда Дизайн', avatar: '', lastMessage: 'Отправил макеты', time: '13:15', unread: 0, online: false },
  { id: 3, name: 'Максим Иванов', avatar: '', lastMessage: 'Созвон в 15:00?', time: '12:48', unread: 1, online: true },
  { id: 4, name: 'Мама', avatar: '', lastMessage: 'Не забудь купить хлеб', time: 'Вчера', unread: 0, online: false },
];

const mockContacts: Contact[] = [
  { id: 1, name: 'Алиса Петрова', avatar: '', status: 'В сети', online: true },
  { id: 2, name: 'Максим Иванов', avatar: '', status: 'В сети', online: true },
  { id: 3, name: 'Команда Дизайн', avatar: '', status: '5 участников', online: false },
  { id: 4, name: 'Мама', avatar: '', status: 'Была 2 часа назад', online: false },
];

const mockMessages: Message[] = [
  { id: 1, text: 'Привет! Как дела?', time: '14:30', sender: 'other', type: 'text' },
  { id: 2, text: 'Отлично! Работаю над новым проектом', time: '14:31', sender: 'me', type: 'text' },
  { id: 3, type: 'voice', time: '14:32', sender: 'other', duration: '0:15', reactions: ['👍', '😊'] },
  { id: 4, text: 'О, интересно! Расскажешь подробнее?', time: '14:32', sender: 'other', type: 'text' },
  { id: 5, type: 'video', time: '14:33', sender: 'me', duration: '0:08' },
  { id: 6, text: 'Конечно! Это мессенджер с крутыми фичами', time: '14:33', sender: 'me', type: 'text', reactions: ['🔥'] },
];

const emojiList = ['😊', '❤️', '👍', '🔥', '😂', '😍', '🎉', '✨', '💯', '🚀'];
const stickerPacks = [
  { id: 1, name: 'Кот', emoji: '🐱' },
  { id: 2, name: 'Собака', emoji: '🐶' },
  { id: 3, name: 'Панда', emoji: '🐼' },
  { id: 4, name: 'Лиса', emoji: '🦊' },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState<'chats' | 'contacts' | 'profile' | 'settings' | 'notifications'>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const handleReaction = (messageId: number, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        return { ...msg, reactions: [...reactions, emoji] };
      }
      return msg;
    }));
  };

  const startVoiceRecording = () => {
    setIsRecordingVoice(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      if (isRecordingVoice) {
        const newMessage: Message = {
          id: messages.length + 1,
          type: 'voice',
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          sender: 'me',
          duration: `0:${String(recordingTime).padStart(2, '0')}`
        };
        setMessages([...messages, newMessage]);
        setIsRecordingVoice(false);
        setRecordingTime(0);
      }
    }, 3000);
  };

  const startVideoRecording = () => {
    setIsRecordingVideo(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      if (isRecordingVideo) {
        const newMessage: Message = {
          id: messages.length + 1,
          type: 'video',
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          sender: 'me',
          duration: `0:${String(recordingTime).padStart(2, '0')}`
        };
        setMessages([...messages, newMessage]);
        setIsRecordingVideo(false);
        setRecordingTime(0);
      }
    }, 3000);
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <aside className="w-20 bg-gradient-to-b from-primary to-secondary flex flex-col items-center py-6 gap-6 shadow-xl">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-primary text-xl shadow-lg hover-scale cursor-pointer">
          D
        </div>
        
        <nav className="flex-1 flex flex-col gap-4">
          {[
            { id: 'chats', icon: 'MessageSquare', label: 'Чаты' },
            { id: 'contacts', icon: 'Users', label: 'Контакты' },
            { id: 'notifications', icon: 'Bell', label: 'Уведомления' },
            { id: 'profile', icon: 'User', label: 'Профиль' },
            { id: 'settings', icon: 'Settings', label: 'Настройки' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-white text-primary shadow-lg scale-110'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title={item.label}
            >
              <Icon name={item.icon} size={24} />
            </button>
          ))}
        </nav>
      </aside>

      {activeSection === 'chats' && (
        <>
          <aside className="w-80 bg-card border-r border-border flex flex-col animate-slide-in-left">
            <div className="p-6 border-b border-border">
              <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Dialogo
              </h1>
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Поиск чатов..." className="pl-10" />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {mockChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 hover-scale mb-2 ${
                      selectedChat?.id === chat.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                            {chat.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {chat.online && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <Badge className="bg-secondary animate-bounce-in">{chat.unread}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </aside>

          <main className="flex-1 flex flex-col animate-fade-in">
            {selectedChat ? (
              <>
                <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedChat.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                        {selectedChat.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">{selectedChat.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {selectedChat.online ? 'В сети' : 'Был(а) недавно'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="hover-scale">
                      <Icon name="Phone" size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover-scale">
                      <Icon name="Video" size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover-scale">
                      <Icon name="MoreVertical" size={20} />
                    </Button>
                  </div>
                </header>

                <ScrollArea className="flex-1 p-6 bg-gradient-to-br from-background via-muted/20 to-background">
                  <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} animate-scale-in`}
                      >
                        <div className="group relative max-w-md">
                          {message.type === 'voice' ? (
                            <div
                              className={`flex items-center gap-3 px-4 py-3 rounded-full ${
                                message.sender === 'me'
                                  ? 'bg-gradient-to-r from-primary to-secondary text-white'
                                  : 'bg-card border border-border'
                              } shadow-md hover-scale min-w-[200px]`}
                            >
                              <Button
                                size="icon"
                                variant="ghost"
                                className={`w-8 h-8 rounded-full ${
                                  message.sender === 'me' ? 'text-white hover:bg-white/20' : 'hover:bg-muted'
                                }`}
                              >
                                <Icon name="Play" size={16} />
                              </Button>
                              <div className="flex-1 flex flex-col gap-1">
                                <div className={`h-1 rounded-full ${
                                  message.sender === 'me' ? 'bg-white/30' : 'bg-muted'
                                } relative overflow-hidden`}>
                                  <div className={`absolute h-full w-2/3 rounded-full ${
                                    message.sender === 'me' ? 'bg-white' : 'bg-primary'
                                  }`} />
                                </div>
                                <span className={`text-xs ${
                                  message.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'
                                }`}>
                                  {message.duration}
                                </span>
                              </div>
                              <Icon name="Mic" size={16} className={message.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'} />
                            </div>
                          ) : message.type === 'video' ? (
                            <div
                              className={`relative rounded-full overflow-hidden ${
                                message.sender === 'me'
                                  ? 'bg-gradient-to-br from-primary to-secondary'
                                  : 'bg-gradient-to-br from-accent to-secondary'
                              } shadow-xl hover-scale cursor-pointer`}
                              style={{ width: '180px', height: '180px' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <Icon name="Play" size={48} className="text-white mb-2" />
                                  <span className="text-white text-sm font-medium">{message.duration}</span>
                                </div>
                              </div>
                              <div className="absolute top-3 right-3">
                                <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
                                  <Icon name="VideoIcon" size={16} className="text-white" />
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>
                          ) : (
                            <div
                              className={`px-4 py-3 rounded-2xl ${
                                message.sender === 'me'
                                  ? 'bg-gradient-to-r from-primary to-secondary text-white'
                                  : 'bg-card border border-border'
                              } shadow-md hover-scale`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <span className={`text-xs mt-1 block ${
                                message.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'
                              }`}>
                                {message.time}
                              </span>
                            </div>
                          )}
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="absolute -bottom-3 right-2 flex gap-1 bg-background border border-border rounded-full px-2 py-1 shadow-lg">
                              {message.reactions.map((emoji, idx) => (
                                <span key={idx} className="text-sm">{emoji}</span>
                              ))}
                            </div>
                          )}
                          <div className="absolute top-0 right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1 bg-card border border-border rounded-full p-1 shadow-lg">
                              {['❤️', '👍', '😂'].map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReaction(message.id, emoji)}
                                  className="w-7 h-7 hover:scale-125 transition-transform"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <footer className="bg-card border-t border-border p-4">
                  {isRecordingVoice && (
                    <div className="max-w-4xl mx-auto mb-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                        <Icon name="Mic" size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Запись голосового сообщения...</p>
                        <p className="text-xs text-muted-foreground">0:{String(recordingTime).padStart(2, '0')}</p>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => setIsRecordingVoice(false)}>
                        Отмена
                      </Button>
                    </div>
                  )}
                  
                  {isRecordingVideo && (
                    <div className="max-w-4xl mx-auto mb-4 p-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-secondary flex items-center justify-center">
                        <Icon name="VideoIcon" size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Запись видео кружочка...</p>
                        <p className="text-xs text-muted-foreground">0:{String(recordingTime).padStart(2, '0')}</p>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => setIsRecordingVideo(false)}>
                        Отмена
                      </Button>
                    </div>
                  )}

                  <div className="max-w-4xl mx-auto flex items-end gap-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={startVoiceRecording}
                        disabled={isRecordingVoice || isRecordingVideo}
                        className="hover-scale"
                      >
                        <Icon name="Mic" size={22} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={startVideoRecording}
                        disabled={isRecordingVoice || isRecordingVideo}
                        className="hover-scale"
                      >
                        <Icon name="VideoIcon" size={22} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setShowStickers(!showStickers);
                          setShowEmojiPicker(false);
                        }}
                        className="hover-scale"
                      >
                        <Icon name="Smile" size={22} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setShowEmojiPicker(!showEmojiPicker);
                          setShowStickers(false);
                        }}
                        className="hover-scale"
                      >
                        <Icon name="Heart" size={22} />
                      </Button>
                    </div>

                    <div className="flex-1 relative">
                      {showEmojiPicker && (
                        <div className="absolute bottom-full mb-2 left-0 bg-card border border-border rounded-2xl p-4 shadow-xl animate-scale-in">
                          <div className="grid grid-cols-5 gap-2">
                            {emojiList.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  setMessageText(messageText + emoji);
                                  setShowEmojiPicker(false);
                                }}
                                className="text-2xl hover:scale-125 transition-transform"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {showStickers && (
                        <div className="absolute bottom-full mb-2 left-0 bg-card border border-border rounded-2xl p-4 shadow-xl animate-scale-in w-80">
                          <h3 className="font-semibold mb-3">Стикеры</h3>
                          <div className="grid grid-cols-4 gap-3">
                            {stickerPacks.map((sticker) => (
                              <button
                                key={sticker.id}
                                onClick={() => {
                                  setMessageText(messageText + sticker.emoji);
                                  setShowStickers(false);
                                }}
                                className="aspect-square bg-muted/50 rounded-xl flex items-center justify-center text-4xl hover:scale-110 hover:bg-primary/10 transition-all"
                              >
                                {sticker.emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Введите сообщение..."
                        className="rounded-full"
                      />
                    </div>

                    <Button
                      onClick={handleSendMessage}
                      className="rounded-full bg-gradient-to-r from-primary to-secondary hover-scale"
                      size="icon"
                    >
                      <Icon name="Send" size={20} />
                    </Button>
                  </div>
                </footer>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center animate-fade-in">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Icon name="MessageSquare" size={64} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Выберите чат</h2>
                  <p className="text-muted-foreground">Начните общаться прямо сейчас!</p>
                </div>
              </div>
            )}
          </main>
        </>
      )}

      {activeSection === 'contacts' && (
        <main className="flex-1 p-8 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Контакты
            </h1>
            <div className="relative mb-6">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Поиск контактов..." className="pl-10" />
            </div>
            <div className="grid gap-3">
              {mockContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 bg-card rounded-2xl border border-border hover-scale cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.status}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="hover-scale">
                      <Icon name="MessageCircle" size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {activeSection === 'profile' && (
        <main className="flex-1 p-8 animate-fade-in">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-4xl">
                  Я
                </AvatarFallback>
              </Avatar>
              <h1 className="text-3xl font-bold mb-2">Мой Профиль</h1>
              <p className="text-muted-foreground">В сети</p>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-card rounded-2xl border border-border">
                <h2 className="font-semibold mb-4 text-lg">Личная информация</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Имя</span>
                    <span className="font-medium">Пользователь Dialogo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Телефон</span>
                    <span className="font-medium">+7 (999) 123-45-67</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">user@dialogo.app</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-card rounded-2xl border border-border">
                <h2 className="font-semibold mb-4 text-lg">О себе</h2>
                <p className="text-muted-foreground">
                  Привет! Я использую Dialogo для общения 💬
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {activeSection === 'settings' && (
        <main className="flex-1 p-8 animate-fade-in">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Настройки
            </h1>
            
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Общие</TabsTrigger>
                <TabsTrigger value="notifications">Уведомления</TabsTrigger>
                <TabsTrigger value="privacy">Приватность</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="p-6 bg-card rounded-2xl border border-border">
                  <h2 className="font-semibold mb-4">Внешний вид</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Тёмная тема</span>
                      <Button variant="outline" size="sm">Вкл</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Размер шрифта</span>
                      <Button variant="outline" size="sm">Средний</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <div className="p-6 bg-card rounded-2xl border border-border">
                  <h2 className="font-semibold mb-4">Уведомления</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Звук сообщений</span>
                      <Button variant="outline" size="sm">Вкл</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Предпросмотр</span>
                      <Button variant="outline" size="sm">Вкл</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="privacy" className="space-y-4">
                <div className="p-6 bg-card rounded-2xl border border-border">
                  <h2 className="font-semibold mb-4">Приватность</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Статус "В сети"</span>
                      <Button variant="outline" size="sm">Все</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Последняя активность</span>
                      <Button variant="outline" size="sm">Все</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      )}

      {activeSection === 'notifications' && (
        <main className="flex-1 p-8 animate-fade-in">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Уведомления
            </h1>
            <div className="space-y-3">
              {[
                { icon: 'MessageCircle', text: 'Алиса Петрова отправила сообщение', time: '2 мин назад', color: 'from-primary to-secondary' },
                { icon: 'UserPlus', text: 'Максим Иванов добавил вас в контакты', time: '1 час назад', color: 'from-accent to-secondary' },
                { icon: 'Heart', text: 'Мама поставила реакцию на ваше сообщение', time: '3 часа назад', color: 'from-secondary to-primary' },
              ].map((notif, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-card rounded-2xl border border-border hover-scale cursor-pointer transition-all animate-scale-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${notif.color} flex items-center justify-center`}>
                      <Icon name={notif.icon} size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{notif.text}</p>
                      <p className="text-sm text-muted-foreground">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}