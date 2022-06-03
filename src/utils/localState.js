import { useState, useEffect } from "react";

const useLocalState = (key, initial) => {
    const [value, setValue] = useState(() => {
        if (typeof window !== undefined) {
            const saved = window.localStorage.getItem(key);
            if (saved !== null) {
                return JSON.parse(saved);
            }
        }
        return initial;
    });
    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [value]);
    return [value, setValue];
}

export default useLocalState;