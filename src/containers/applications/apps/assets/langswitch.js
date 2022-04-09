import React from "react";
import i18next from 'i18next';

function langswitch() {

  return (
    <div className="langSwitcher">
      <select
        value={i18n.language}
        onChange={(e) =>
          i18n.changeLanguage(e.target.value)
        }
      >
        <option value="en">English</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
}

export default langswitch;
