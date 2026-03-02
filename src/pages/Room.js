import React, { useContext, useState, useCallback, useEffect, useLayoutEffect } from 'react';
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

export const RoomPage = () => {


    useLayoutEffect(() => {

    }, [])

    return (
        <>
            <>
                <div className="app-inner">
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

                        {/* {!loading && */}

                        {/* } */}
                        <FooterInner />
                    </main>
                </div>
            </>
        </>
    )
}