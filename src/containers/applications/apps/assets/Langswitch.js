import React from "react";
import i18next from 'i18next';

function LangSwitch() {

  return (
    <div className="langSwitcher">
      <select
        value={i18next.language}
        onChange={(e) =>
          i18next.changeLanguage(e.target.value)
        }
      >
        <option value="en">English</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
}

export default LangSwitch;
