import React, { createContext, useContext, useState, ReactNode } from "react";

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  youtubeLink: string;
  showingDate: string;
  type: string;
  day?: number;
  session?: "12am-12pm" | "12pm-12am";
}

interface Quiz {
  id: string;
  videoId: string;
  questions: {
    id: string;
    questionEn: string;
    questionTa: string;
    choices: {
      id: string;
      textEn: string;
      textTa: string;
      isCorrect: boolean;
    }[];
    timeLimit: number;
  }[];
  earnings: {
    promotor: number;
    promotor1: number;
    promotor2: number;
    promotor3: number;
    promotor4: number;
  };
}

interface PinRequest {
  id: string;
  userId: string;
  username: string;
  mobile: string;
  currentLevel: string;
  requestedLevel: string;
  status: "pending" | "approved" | "activated";
  requestDate: string;
}

interface ReferralSetting {
  level: string;
  ranges: {
    from: number;
    to: number;
    amount: number;
  }[];
}

interface DataContextType {
  dailyVideos: Video[];
  trainingVideos: Video[];
  promotionVideos: Video[];
  quizzes: Quiz[];
  pinRequests: PinRequest[];
  referralSettings: ReferralSetting[];
  youtubeChannels: any[];
  addVideo: (
    video: Omit<Video, "id">,
    type: "daily" | "training" | "promotion"
  ) => void;
  updateVideo: (
    id: string,
    updates: Partial<Video>,
    type: "daily" | "training" | "promotion"
  ) => void;
  deleteVideo: (id: string, type: "daily" | "training" | "promotion") => void;
  addQuiz: (quiz: Omit<Quiz, "id">) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  updatePinRequest: (id: string, updates: Partial<PinRequest>) => void;
  generatePin: (userId: string, level: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [dailyVideos, setDailyVideos] = useState<Video[]>([
    {
      id: "1",
      title: "Daily Market Update",
      description: "Today's market insights and opportunities",
      videoUrl: "",
      youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      showingDate: "2025-10-10",
      type: "daily",
    },
  ]);

  const [trainingVideos, setTrainingVideos] = useState<Video[]>([
    {
      id: "1",
      title: "Day 1: Company Introduction",
      description: "Welcome to our company and mission overview",
      videoUrl: "",
      youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      showingDate: "2025-10-11",
      type: "training",
      day: 1,
    },
    {
      id: "2",
      title: "Day 2: Company Plan & Vision",
      description: "Understanding our business model and future plans",
      videoUrl: "",
      youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      showingDate: "2025-10-11",
      type: "training",
      day: 2,
    },
  ]);

  const [promotionVideos, setPromotionVideos] = useState<Video[]>([
    {
      id: "1",
      title: "Morning Promotion Strategies",
      description: "Learn effective promotion techniques for morning hours",
      videoUrl: "",
      youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      showingDate: "2025-01-10",
      type: "promotion",
      session: "12am-12pm",
    },
  ]);

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      videoId: "1",
      questions: [
        {
          id: "1",
          questionEn:
            "What is the main focus of our morning promotion strategy?",
          questionTa: "எங்கள் காலை விளம்பர உத்தியின் முக்கிய கவனம் என்ன?",
          choices: [
            {
              id: "1",
              textEn: "Customer engagement",
              textTa: "வாடிக்கையாளர் ஈடுபாடு",
              isCorrect: true,
            },
            {
              id: "2",
              textEn: "Product sales",
              textTa: "தயாரிப்பு விற்பனை",
              isCorrect: false,
            },
          ],
          timeLimit: 30,
        },
        {
          id: "2",
          questionEn:
            "What is the main focus of our morning promotion strategy?",
          questionTa: "எங்கள் காலை விளம்பர உத்தியின் முக்கிய கவனம் என்ன?",
          choices: [
            {
              id: "1",
              textEn: "Customer engagement",
              textTa: "வாடிக்கையாளர் ஈடுபாடு",
              isCorrect: true,
            },
            {
              id: "2",
              textEn: "Product sales",
              textTa: "தயாரிப்பு விற்பனை",
              isCorrect: false,
            },
          ],
          timeLimit: 30,
        },
      ],
      earnings: {
        promotor: 10,
        promotor1: 15,
        promotor2: 20,
        promotor3: 25,
        promotor4: 30,
      },
    },
  ]);

  const [pinRequests, setPinRequests] = useState<PinRequest[]>([
    {
      id: "1",
      userId: "2",
      username: "john_doe",
      mobile: "9876543211",
      currentLevel: "promotor",
      requestedLevel: "promotor1",
      status: "pending",
      requestDate: "2025-01-09",
    },
  ]);

  const [referralSettings, setReferralSettings] = useState<ReferralSetting[]>([
    {
      level: "promotor",
      ranges: [
        { from: 1, to: 5, amount: 100 },
        { from: 6, to: 10, amount: 150 },
      ],
    },
  ]);

  const [youtubeChannels, setYoutubeChannels] = useState([
    {
      id: "1",
      name: "Official Company Channel",
      url: "https://youtube.com/@company",
      description: "Main company updates and announcements",
    },
  ]);

  const addVideo = (
    video: Omit<Video, "id">,
    type: "daily" | "training" | "promotion"
  ) => {
    const newVideo = { ...video, id: Date.now().toString() };

    if (type === "daily") {
      setDailyVideos((prev) => [...prev, newVideo]);
    } else if (type === "training") {
      setTrainingVideos((prev) => [...prev, newVideo]);
    } else {
      setPromotionVideos((prev) => [...prev, newVideo]);
    }
  };

  const updateVideo = (
    id: string,
    updates: Partial<Video>,
    type: "daily" | "training" | "promotion"
  ) => {
    if (type === "daily") {
      setDailyVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
      );
    } else if (type === "training") {
      setTrainingVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
      );
    } else {
      setPromotionVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
      );
    }
  };

  const deleteVideo = (
    id: string,
    type: "daily" | "training" | "promotion"
  ) => {
    if (type === "daily") {
      setDailyVideos((prev) => prev.filter((v) => v.id !== id));
    } else if (type === "training") {
      setTrainingVideos((prev) => prev.filter((v) => v.id !== id));
    } else {
      setPromotionVideos((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const addQuiz = (quiz: Omit<Quiz, "id">) => {
    const newQuiz = { ...quiz, id: Date.now().toString() };
    setQuizzes((prev) => [...prev, newQuiz]);
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const updatePinRequest = (id: string, updates: Partial<PinRequest>) => {
    setPinRequests((prev) =>
      prev.map((pr) => (pr.id === id ? { ...pr, ...updates } : pr))
    );
  };

  const generatePin = (userId: string, level: string) => {
    // Logic to generate and approve pin request
    updatePinRequest(userId, { status: "approved" });
  };

  return (
    <DataContext.Provider
      value={{
        dailyVideos,
        trainingVideos,
        promotionVideos,
        quizzes,
        pinRequests,
        referralSettings,
        youtubeChannels,
        addVideo,
        updateVideo,
        deleteVideo,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        updatePinRequest,
        generatePin,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
