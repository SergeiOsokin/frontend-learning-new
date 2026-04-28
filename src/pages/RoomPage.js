import React, { useContext, useState, useCallback, useEffect, useLayoutEffect, useRef, useOptimistic } from 'react';
import socket from '../constants/socket';
import { Link, useHistory } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { Loader } from '../components/Loader';
import { useMessage } from '../hooks/message.hook';
import { validation } from '../hooks/validation.hook';
import { Aside } from '../components/Aside';
import { autoResize } from '../hooks/autoResize.hook';
import { FooterInner } from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { STEP } from '../constants/const';
import { v4 } from 'uuid';

export const RoomPage = () => {
    const history = useHistory();
    const [rooms, updateRooms] = useState([]);
    const rootNode = useRef();

    useEffect(() => {
        socket.on(STEP.SHARE_ROOMS, ({ rooms = [] } = {}) => {
            if (rootNode.current) {
                updateRooms(rooms);
            }
        });
    }, []);

    return (
        <>
            <>
                <div className="app-inner" ref={rootNode}>
                    <Aside />

                    <main className="app-main">
                        <header className="app-main__top">
                            <div className="app-main__left">
                                <h1 className="app-main__title">Видеочат</h1>
                            </div>
                            <div className="app-main__right">
                                <div className="app-main__search search" />
                            </div>
                        </header>

                        {/* {loading && <Loader />} */}

                        <ul className="app-cards__inner">
                            <li className="app-cards__item">
                                <button className="card-add" onClick={() => {
                                    history.push(`/room/${v4()}`)
                                }}>
                                    <svg className="card-add__icon" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M5 12H19M12 19V5"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="card-add__text">Новая комната</span>
                                </button>
                            </li>
                            {rooms
                                .map((roomID) => {
                                    return (
                                        <li className="app-cards__item" key={roomID}>
                                            <div className="card card-note">
                                                <div className="card-note__top">
                                                    <p className="card-note__date">DATE</p>
                                                    <div className="card-note__actions">
                                                        <button className="card-note__btn" onClick={() => { history.push(`/room/${roomID}`) }}>
                                                            <svg viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M15.717 4.07486L18.9255 7.28329M7.49999 6.5003H4.125C3.82663 6.5003 3.54048 6.61883 3.3295 6.8298C3.11853 7.04078 3 7.32692 3 7.62528V18.875C3 19.1734 3.11853 19.4595 3.3295 19.6705C3.54048 19.8815 3.82663 20 4.125 20H16.5C16.7983 20 17.0845 19.8815 17.2955 19.6705C17.5064 19.4595 17.625 19.1734 17.625 18.875V13.8126M20.3351 2.66414C20.5459 2.87485 20.7131 3.12503 20.8272 3.40038C20.9413 3.67574 21 3.97087 21 4.26892C21 4.56697 20.9413 4.8621 20.8272 5.13745C20.7131 5.4128 20.5459 5.66298 20.3351 5.87369L12.6356 13.573L8.62499 14.3751L9.42711 10.3646L17.1266 2.66527C17.3371 2.45437 17.5872 2.28706 17.8625 2.17291C18.1378 2.05876 18.4328 2 18.7308 2C19.0289 2 19.3239 2.05876 19.5992 2.17291C19.8745 2.28706 20.1245 2.45437 20.3351 2.66527V2.66414Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth={2}
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="card-note__content">
                                                    <h3 className="card-note__title">uuid</h3>
                                                    <p className="card-note__text">
                                                        {roomID}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                        </ul>

                        {/* {!loading && */}

                        {/* } */}
                        <FooterInner />
                    </main>
                </div>
            </>
        </>
    )
}