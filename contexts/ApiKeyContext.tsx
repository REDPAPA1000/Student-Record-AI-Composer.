import React, { createContext, useState, useEffect, useContext } from 'react';

interface ApiKeyContextType {
    apiKey: string;
    setApiKey: (key: string) => void;
    hasKey: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType>({ apiKey: '', setApiKey: () => { }, hasKey: false });

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [apiKey, setApiKeyState] = useState('');
    const [hasKey, setHasKey] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('gemini_api_key');
        if (stored) {
            const cleaned = stored.trim();
            setApiKeyState(cleaned);
            setHasKey(!!cleaned);
            // 만약 불필요한 공백이 있었다면 로컬 스토리지도 즉시 업데이트하여 정화
            if (stored !== cleaned) {
                localStorage.setItem('gemini_api_key', cleaned);
            }
        }
    }, []);

    const setApiKey = (key: string) => {
        const trimmedKey = key.trim();
        setApiKeyState(trimmedKey);
        if (trimmedKey) {
            localStorage.setItem('gemini_api_key', trimmedKey);
            setHasKey(true);
        } else {
            localStorage.removeItem('gemini_api_key');
            setHasKey(false);
        }
    };

    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey, hasKey }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

export const useApiKey = () => useContext(ApiKeyContext);