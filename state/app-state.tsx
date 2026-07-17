import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";

export type TeacherMode = "Gentle" | "Balanced" | "Focused";
export type StudentProfile = {
  name: string;
  email: string;
  ageGroup: "Child" | "Teen" | "Adult";
  goal: string;
};

export type LearningPlan = {
  currentJuz: number;
  currentSurah: string;
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  dailyTarget: string;
  revisionDue: number;
  streak: number;
  progress: number;
};

export type Preferences = {
  language: string;
  teacherMode: TeacherMode;
  playbackSpeed: number;
  autoReplay: boolean;
  reciter: string;
  saveRecitations: boolean;
  improvementAnalytics: boolean;
};

export type AppState = {
  hydrated: boolean;
  onboardingComplete: boolean;
  signedIn: boolean;
  profile: StudentProfile;
  learningPlan: LearningPlan;
  preferences: Preferences;
};

type PersistedState = Omit<AppState, "hydrated">;

type Action =
  | { type: "HYDRATE"; payload?: Partial<PersistedState> }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "SIGN_IN"; payload?: Partial<StudentProfile> }
  | { type: "SIGN_OUT" }
  | { type: "UPDATE_PROFILE"; payload: Partial<StudentProfile> }
  | { type: "UPDATE_PLAN"; payload: Partial<LearningPlan> }
  | { type: "UPDATE_PREFERENCES"; payload: Partial<Preferences> };

const STORAGE_KEY = "hifz.phase1.state.v1";

export const initialAppState: AppState = {
  hydrated: false,
  onboardingComplete: false,
  signedIn: false,
  profile: {
    name: "Amina",
    email: "amina@example.com",
    ageGroup: "Adult",
    goal: "Memorize with steady daily practice",
  },
  learningPlan: {
    currentJuz: 30,
    currentSurah: "An-Naba",
    surahNumber: 78,
    startAyah: 1,
    endAyah: 5,
    dailyTarget: "Ayahs 1–5",
    revisionDue: 2,
    streak: 12,
    progress: 68,
  },
  preferences: {
    language: "English",
    teacherMode: "Balanced",
    playbackSpeed: 1,
    autoReplay: true,
    reciter: "Not selected",
    saveRecitations: false,
    improvementAnalytics: false,
  },
};

export function appStateReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        ...action.payload,
        profile: { ...state.profile, ...action.payload?.profile },
        learningPlan: { ...state.learningPlan, ...action.payload?.learningPlan },
        preferences: { ...state.preferences, ...action.payload?.preferences },
        hydrated: true,
      };
    case "COMPLETE_ONBOARDING":
      return { ...state, onboardingComplete: true };
    case "SIGN_IN":
      return { ...state, signedIn: true, profile: { ...state.profile, ...action.payload } };
    case "SIGN_OUT":
      return { ...state, signedIn: false };
    case "UPDATE_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case "UPDATE_PLAN":
      return { ...state, learningPlan: { ...state.learningPlan, ...action.payload } };
    case "UPDATE_PREFERENCES":
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
    default:
      return state;
  }
}

type AppStateContextValue = AppState & {
  completeOnboarding: () => void;
  signIn: (profile?: Partial<StudentProfile>) => void;
  signOut: () => void;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  updateLearningPlan: (plan: Partial<LearningPlan>) => void;
  updatePreferences: (preferences: Partial<Preferences>) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appStateReducer, initialAppState);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!active) return;
        const payload = value ? (JSON.parse(value) as Partial<PersistedState>) : undefined;
        dispatch({ type: "HYDRATE", payload });
      })
      .catch(() => {
        if (active) dispatch({ type: "HYDRATE" });
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated: _hydrated, ...persisted } = state;
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  }, [state]);

  const completeOnboarding = useCallback(() => dispatch({ type: "COMPLETE_ONBOARDING" }), []);
  const signIn = useCallback((profile?: Partial<StudentProfile>) => dispatch({ type: "SIGN_IN", payload: profile }), []);
  const signOut = useCallback(() => dispatch({ type: "SIGN_OUT" }), []);
  const updateProfile = useCallback((profile: Partial<StudentProfile>) => dispatch({ type: "UPDATE_PROFILE", payload: profile }), []);
  const updateLearningPlan = useCallback((plan: Partial<LearningPlan>) => dispatch({ type: "UPDATE_PLAN", payload: plan }), []);
  const updatePreferences = useCallback((preferences: Partial<Preferences>) => dispatch({ type: "UPDATE_PREFERENCES", payload: preferences }), []);

  const value = useMemo(
    () => ({ ...state, completeOnboarding, signIn, signOut, updateProfile, updateLearningPlan, updatePreferences }),
    [state, completeOnboarding, signIn, signOut, updateProfile, updateLearningPlan, updatePreferences],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used inside AppStateProvider");
  return context;
}
