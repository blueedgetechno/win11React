import React from "react";
import { useTranslation } from "react-i18next";

function langswitch() {
  const { i18n } = useTranslation();

  return (
    <div className="select">
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
