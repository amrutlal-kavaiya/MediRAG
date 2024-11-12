import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Paperclip, Video, X, User, Bot, Minus, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  attachmentType?: 'image' | 'file' | 'audio';
  attachmentUrl?: string;
}

interface Particle {
  x: number;
  y: number;
  char: string;
  size: number;
  speed: number;
  direction: number;
}

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
                  'اابتثجحخدذرزسشصضطظعغفقكلمنهوي' +
                  'अआइईउऊऋएऐओऔअंअःकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहक्षत्रज्ञ' +
                  '��ਆਇਈਉਊਏਐਓਔਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਵਸ਼ਸਹਖ਼ਗ਼ਜ਼ਫ਼' +
                  'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ' +
                  'అఆఇఈఉఊఋఎఏఐఒఓఔఅంఅఃకఖగఘఙచఛజఝఞటఠడఢణతథదధనపఫబభమయరలవశషసహళక్షజ్ఞ' +
                  'ಅಆಇಈಉಊಋಎಏಐಒಓಔಅಂಅಃಕಖಗಘಙಚಛಜಝಞಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಲವಶಷಸಹಳಕ್��ಜ್ಞ' +
                  '안녕하세요 세계';

const MentalHealthSupport: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        char: alphabets[Math.floor(Math.random() * alphabets.length)],
        size: 20 + Math.random() * 20,
        speed: 0.2 + Math.random() * 0.5,
        direction: Math.random() * Math.PI * 2
      });
    }
    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(128, 0, 128, 0.2)';
      
      particles.forEach(particle => {
        ctx.font = `${particle.size}px Arial`;
        ctx.fillText(particle.char, particle.x, particle.y);

        particle.x += Math.cos(particle.direction) * particle.speed * animationSpeed;
        particle.y += Math.sin(particle.direction) * particle.speed * animationSpeed;

        if (particle.x < 0 || particle.x > canvas.width) particle.direction = Math.PI - particle.direction;
        if (particle.y < 0 || particle.y > canvas.height) particle.direction = -particle.direction;

        if (Math.random() < 0.001) {
          particle.direction += (Math.random() - 0.5) * Math.PI / 4;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [animationSpeed]);

  const sendMessageToBackend = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://sturdy-space-broccoli-7776j7j56jcx59r-3001.app.github.dev/api/mental-health-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending message to backend:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (input.trim() || selectedFile) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input,
        sender: 'user',
        timestamp: new Date(),
      };

      if (selectedFile) {
        newMessage.attachmentType = selectedFile.type.startsWith('image/') ? 'image' : 'file';
        newMessage.attachmentUrl = URL.createObjectURL(selectedFile);
      }

      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput('');
      setSelectedFile(null);

      // Get response from backend
      const botResponse = await sendMessageToBackend(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRecordAudio = () => {
    setIsRecording(!isRecording);
    // Here you would implement actual audio recording logic
  };

  const handleOpenVideo = () => {
    setIsVideoOpen(true);
  };

  const adjustAnimationSpeed = (increment: boolean) => {
    setAnimationSpeed(prevSpeed => {
      const newSpeed = increment ? prevSpeed + 0.1 : prevSpeed - 0.1;
      return Math.max(0.1, Math.min(2, newSpeed));
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="bg-purple-600 text-white p-4 relative z-10">
        <h1 className="text-2xl font-bold">Mental Health Support</h1>
        <div className="flex items-center mt-2">
          <button onClick={() => adjustAnimationSpeed(false)} className="mr-2 p-1 bg-purple-700 rounded">
            <Minus size={16} />
          </button>
          <span>Animation Speed: {animationSpeed.toFixed(1)}x</span>
          <button onClick={() => adjustAnimationSpeed(true)} className="ml-2 p-1 bg-purple-700 rounded">
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4 relative z-10">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex mb-4 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            } animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`flex items-end ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`rounded-full p-2 ${message.sender === 'user' ? 'bg-purple-500' : 'bg-gray-300'}`}>
                {message.sender === 'user' ? (
                  <User size={24} className="text-white" />
                ) : (
                  <Bot size={24} className="text-gray-600" />
                )}
              </div>
              <div
                className={`max-w-2xl mx-2 p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-300 text-gray-800'
                } animate-bounce-in`}
              >
                {message.attachmentType === 'image' && (
                  <img
                    src={message.attachmentUrl}
                    alt="Uploaded"
                    className="max-w-xs mb-2 rounded"
                  />
                )}
                {message.attachmentType === 'file' && (
                  <a
                    href={message.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Attached File
                  </a>
                )}
                {message.sender === 'bot' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;
                        return isInline ? (
                          <code className={`${className} bg-gray-800 text-gray-100 px-1 rounded`} {...props}>
                            {children}
                          </code>
                        ) : (
                          <SyntaxHighlighter
                            style={vs2015 as any} // Type assertion to resolve the type error
                            language={match ? match[1] : 'text'}
                            PreTag="div"
                            className="rounded-md"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        );
                      },
                      // Style other Markdown elements
                      h1: ({ children }) => <h1 className="text-2xl font-bold my-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold my-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-bold my-2">{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc ml-6 my-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal ml-6 my-2">{children}</ol>,
                      li: ({ children }) => <li className="my-1">{children}</li>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-500 pl-4 my-2 italic">
                          {children}
                        </blockquote>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                          <table className="min-w-full border border-gray-400">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="border border-gray-400 px-4 py-2 bg-gray-100">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-gray-400 px-4 py-2">
                          {children}
                        </td>
                      ),
                      a: ({ children, href }) => (
                        <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                ) : (
                  message.text
                )}
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="bg-white p-4 relative z-10">
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={handleRecordAudio}
            className={`p-2 rounded-full transition-colors ${
              isRecording ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <Mic size={20} />
          </button>
          <button
            onClick={handleOpenVideo}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <Video size={20} />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`p-2 rounded-full bg-purple-500 text-white transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Relaxation Video</h2>
              <button onClick={() => setIsVideoOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.youtube.com/embed/inpok4MKVLM"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                title="Relaxation Video"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalHealthSupport;