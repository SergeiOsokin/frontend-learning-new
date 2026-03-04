import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Aside } from '../components/Aside';
import { FooterInner } from '../components/Footer';
import usePagination from '../hooks/pagination.hook';
import { useImperativeHandle } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';

export const Room = () => {

    const { id: roomID } = useParams();

    console.log(roomID)

    useWebRTC(roomID);

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

                        <FooterInner />
                    </main>
                </div>
            </>
        </>
    )
};