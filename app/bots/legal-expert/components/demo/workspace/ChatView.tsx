import { type FC } from 'react';
import { type ChatMessage, type LawyerProfile } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  handleSendMessage: () => void;
  isTyping: boolean;
  lawyer: LawyerProfile;
}

export const ChatView: FC<ChatViewProps> = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isTyping,
  lawyer,
}) => {
  return (
    <div className="h-full flex flex-col bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700">
      <div className="px-6 py-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">💬 Live Chat</h2>
        <p className="text-sm text-slate-400">AI + {lawyer.username} • No appointments needed</p>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender !== 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white flex-shrink-0">
                {msg.avatar}
              </div>
            )}
            <div
              className={`max-w-md ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-slate-700'} rounded-2xl px-4 py-3`}
            >
              <p className="text-xs text-slate-300 mb-1">{msg.senderName}</p>
              <p className="text-white text-sm">{msg.content}</p>
              <p className="text-xs text-slate-400 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              🤖
            </div>
            <div className="bg-slate-700 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask AI or your lawyer anything..."
            className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
