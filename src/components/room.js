import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Aside } from '../components/Aside';
import { FooterInner } from '../components/Footer';
import usePagination from '../hooks/pagination.hook';
import { useImperativeHandle } from 'react';
import { LOCAL_VIDEO, useWebRTC } from '../hooks/useWebRTC';

export const Room = () => {

    const { id: roomID } = useParams();
    const { clients, provideMediaRef } = useWebRTC(roomID);

    // return (
    //     <div style={{
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         flexWrap: 'wrap',
    //         height: '100vh',
    //     }}>
    //         {clients.map((clientID, index) => {
    //             return (
    //                 <div key={clientID} id={clientID}>
    //                     <video
    //                         width='100%'
    //                         height='100%'
    //                         ref={instance => {
    //                             provideMediaRef(clientID, instance);
    //                         }}
    //                         autoPlay
    //                         playsInline
    //                         muted={clientID === LOCAL_VIDEO}
    //                     />
    //                 </div>
    //             );
    //         })}
    //     </div>
    // );

    return (
        <>
            <>
                <div className="app-inner" >
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
                                        <li className="app-cards__item" key={clientID}>
                                            <div className="video video-card">
                                                <video
                                                    width='100%'
                                                    height='100%'
                                                    key={clientID + 1}
                                                    info={clientID}
                                                    autoPlay
                                                    playsInline
                                                    muted={clientID === LOCAL_VIDEO}
                                                    ref={instance => {
                                                        provideMediaRef(clientID, instance)
                                                    }}
                                                >
                                                </video>
                                                {/* <div className="card-note__content">
                                                    <h3 className="card-note__title">uuid</h3>
                                                    <p className="card-note__text">
                                                        {clientID}
                                                    </p>
                                                </div> */}
                                            </div>
                                        </li>
                                    )
                                })}
                        </div>

                        <FooterInner />
                    </main>
                </div>
            </>
        </>
    )
};