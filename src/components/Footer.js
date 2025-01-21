import React from 'react';

export const Footer = () => {

  return (
    <footer className="footer">
      <p className="footer__copirate">&copy; 2025 Learnew. Все права защищены.</p>
      <div className="footer__link-group">
        <a className="footer__link" href="./">Поддержка</a>
        <a className="footer__link" href="./">Условия использования</a>
        <a className="footer__link" href="./">Политика конфиденциальности</a>
      </div>
      {/* <a className="footer__link footer__link_GH" href="https://vk.com/sergei_osokin" rel="no noreferrer" target="_blank">ВК</a> */}
    </footer>
  )
}