import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Aside } from '../components/Aside';
import { FooterInner } from '../components/Footer';
import usePagination from '../hooks/pagination.hook';
import { useImperativeHandle } from 'react';
import { LOCAL_VIDEO, useWebRTC } from '../hooks/useWebRTC';

export const Room = () => {

    const { id: roomID } = useParams();
    const { clients, provideMediaRef } = useWebRTC(roomID);

    console.log(clients)



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

                        <div>
                            {clients
                                .map((clientID) => {
                                    return (
                                        // <li className="app-cards__item" key={clientID}>
                                        //     <div className="card card-note">
                                        <video
                                            // className="card-note__top"
                                            autoPlay
                                            playsInline
                                            muted={clientID === LOCAL_VIDEO}
                                            ref={instance => {
                                                provideMediaRef(clientID, instance)
                                            }}
                                        >
                                            asd
                                        </video>
                                        //         <div className="card-note__content">
                                        //             <h3 className="card-note__title">uuid</h3>
                                        //             <p className="card-note__text">
                                        //                 {clientID}
                                        //             </p>
                                        //         </div>
                                        //     </div>
                                        // </li>
                                    )
                                })}
                        </div>

                        {/* <ul className="app-cards__inner"> */}

                        {/* </ul> */}

                        <FooterInner />
                    </main>
                </div>
            </>
        </>
    )
};