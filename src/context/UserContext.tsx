import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

export interface UserData {
  username: string;
  xp: number;
  streak: number;
  completedModules: string[];
  rank: string;
}

interface UserContextType {
  user: UserData | null;
  login: (username: string) => void;
  logout: () => void;
  addXp: (amount: number) => void;
  completeModule: (moduleId: string, customXp?: number) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  initialChatPrompt: string | null;
  openChatWithPrompt: (prompt: string) => void;
}

const defaultUser: UserData = {
  username: '',
  xp: 0,
  streak: 1,
  completedModules: [],
  rank: 'Новичок',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('projectX_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('projectX_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('projectX_user');
    }
  }, [user]);

  const openChatWithPrompt = (prompt: string) => {
    setInitialChatPrompt(prompt);
    setChatOpen(true);
  };

  const login = (username: string) => {
    setUser({ ...defaultUser, username });
  };

  const logout = () => {
    setUser(null);
  };

  const updateRank = (xp: number) => {
    if (xp >= 75000) return 'X Legend';
    if (xp >= 30000) return 'Phantom';
    if (xp >= 15000) return 'Master';
    if (xp >= 7000) return 'Elite';
    if (xp >= 3000) return 'Advanced';
    if (xp >= 1000) return 'Trader';
    return 'Rookie';
  };

  const addXp = (amount: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newXp = prev.xp + amount;
      return { ...prev, xp: newXp, rank: updateRank(newXp) };
    });
  };

  const completeModule = (moduleId: string, customXp: number = 100) => {
    setUser((prev) => {
      if (!prev) return prev;
      if (prev.completedModules.includes(moduleId)) return prev;
      const newXp = prev.xp + customXp;
      return { 
        ...prev, 
        completedModules: [...prev.completedModules, moduleId],
        xp: newXp,
        rank: updateRank(newXp)
      };
    });
  };

  return (
    <UserContext.Provider value={{ 
      user, login, logout, addXp, completeModule,
      chatOpen, setChatOpen, initialChatPrompt, openChatWithPrompt
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
