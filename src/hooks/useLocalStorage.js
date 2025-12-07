import { useState } from "react";

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);

            // 1차 방어: 로컬스토리지 값이 비어있거나, 이상한 문자열인 경우
            if (!item || item === "null" || item === "undefined") {
                return initialValue;
            }

            // 2. JSON 파싱
            const parsedItem = JSON.parse(item);

            // 3. 2차 방어 (중요 ★): 파싱된 결과가 여전히 문자열 "null" / "undefined" 라면 초기값 반환
            // (이중으로 stringify 된 데이터 방지)
            if (
                parsedItem === null ||
                parsedItem === undefined ||
                parsedItem === "null" ||
                parsedItem === "undefined"
            ) {
                return initialValue;
            }

            return parsedItem;
        } catch (error) {
            console.error("LocalStorage Parse Error:", error);
            // 에러 나면 무조건 초기값 사용
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            if (typeof window !== "undefined") {
                // 저장할 때 null이나 undefined가 들어오면 아예 키를 지우거나 초기값 저장 권장
                if (valueToStore === null || valueToStore === undefined) {
                    window.localStorage.removeItem(key);
                } else {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
