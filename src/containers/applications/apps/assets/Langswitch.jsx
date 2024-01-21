import { useLayoutEffect, useState } from "react";
import { appDispatch, update_language } from "../../../../backend/reducers";
import { localStorageKey } from "../../../../backend/utils/constant";

const allowed = ['ENG', 'VN']
function LangSwitch() {
    const [languageValue, setLanguageValue] = useState('');

    useLayoutEffect(() => {
        let languageLocal = localStorage.getItem(localStorageKey.language) ?? 'ENG'
        if (!allowed.includes(languageLocal))
            languageLocal = 'ENG'

        setLanguageValue(languageLocal)
        appDispatch(update_language(languageLocal));
    }, [])

    const updateLanguage = (e) => {
        const language = e.target.value
        if (!allowed.includes(language))
            return

        localStorage.setItem('language', language);
        setLanguageValue(language);
        appDispatch(update_language(language));
    }
    return (
        <div className="langSwitcher langSwitcherTile">
            <select
                value={languageValue}
                onChange={updateLanguage}
            >
                <option value="ENG">English</option>
                <option value="VN">Vietnamese</option>
            </select>
        </div>
    );
}

export default LangSwitch;
