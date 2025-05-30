import React from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom';

export const Footer = () => {

  return (
    <footer className="o-footer">
      <div className="o-footer__inner container">
        <p className="o-footer__label o-footer__cors">
          © 2025 Learnew. <br /> Все права защищены.
        </p>
        <div className="o-footer__links">
          <a href="mailto:sergei.osokin.rf@mail.ru?subject=Вопрос с learnew" className="app-main__link app-main__text">
            Поддержка
          </a>
          <Link to="#" className="o-footer__label o-footer__link">
            Условия использования
          </Link>
          <Link to="#" className="o-footer__label o-footer__link">
            Политика конфиденциальности
          </Link>
        </div>
      </div >
    </footer >

  )
}

export const FooterInner = () => {

  return (
    <footer className="app-main__bot">
      <p className="app-main__copyright app-main__text">
        © 2025 Learnew. <br /> Все права защищены.
      </p>
      <ul className="app-main__links">
        <li className="app-main__link-wrapper">
          <a href="mailto:sergei.osokin.rf@mail.ru?subject=Вопрос с learnew" className="app-main__link app-main__text">
            Поддержка
          </a>
        </li>
        <li className="app-main__link-wrapper">
          <Link to="#" className="app-main__link app-main__text">
            Условия использования
          </Link>
        </li>
        <li className="app-main__link-wrapper">
          <Link to="#" className="app-main__link app-main__text">
            Политика конфиденциальности
          </Link>
        </li>
      </ul>
    </footer>

  )
}