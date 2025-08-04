import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>אודות OnePercent</h1>
      <div className="about-content">
        <div className="about-section">
          <h2>הסיפור שלנו</h2>
          <p>
            OnePercent נוסדה בשנת 2023 מתוך חזון להביא את האופנה האיכותית ביותר לקהל הישראלי.
            אנחנו מאמינים שכל אחד ראוי ללבוש בגדים איכותיים שגורמים לו להרגיש בטוח ונוח.
          </p>
        </div>
        
        <div className="about-section">
          <h2>המשימה שלנו</h2>
          <p>
            אנחנו שואפים להיות המותג המוביל בישראל לאופנה איכותית ובר-השגה.
            המטרה שלנו היא לספק ללקוחותינו את המוצרים הטובים ביותר במחירים הוגנים.
          </p>
        </div>

        <div className="about-section">
          <h2>הערכים שלנו</h2>
          <ul>
            <li>איכות ללא פשרות</li>
            <li>שירות לקוחות מצוין</li>
            <li>אחריות סביבתית</li>
            <li>חדשנות מתמדת</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;