import { use, useCallback, useEffect, useRef, useState } from "react"
import { useStateWithCallback } from "./useStateWithCallback";
import socket from "../constants/socket";
import { ACTIONS } from "../constants/const";
import freeice from "freeice";
import { toHaveAccessibleDescription } from "@testing-library/jest-dom/matchers";

export const LOCAL_VIDEO = 'LOCAL_VIDEO';

export const useWebRTC = (roomID) => {
    const [clients, updateClients] = useStateWithCallback([]);

    const peerConnections = useRef({});
    const localMediaStreeam = useRef(null);
    const peerMediaElements = useRef({
        [LOCAL_VIDEO]: null,
    });

    const addNewClient = useCallback((newClient, cb) => {
        if (!clients.includes(newClient)) {
            updateClients(list => [...list, newClient], cb)
        }
    }, [clients, updateClients]);

    useEffect(() => {
        async function handleNewPeer({ peerID, createOffer }) {
            if (peerID in peerConnections.current) {
                return console.warn('Уже подключены к ' + peerID);
            }

            peerConnections.current[peerID] = new RTCPeerConnection({
                iceServers: freeice()
            });

            peerConnections.current[peerID].onicepandidate = (e) => {
                if (e.candidate) {
                    socket.emit(ACTIONS.RELAY_ICE, {
                        peerID,
                        iceCandidate: e.candidate
                    })
                }
            };

            let tracksNumber = 0;
            peerConnections.current[peerID].ontrack = ({ streams: [remoteStream] }) => {
                tracksNumber++;

                if (tracksNumber === 2) { //video and audio
                    addNewClient(peerID, () => {
                        peerMediaElements.current[peerID].srcObject = remoteStream
                    })
                }

            }
            // контент который будет отправляться
            localMediaStreeam.current.getTracks().forEach((track) => {
                console.log(track)
                peerConnections.current[peerID].addTrack(track, localMediaStreeam.current);
            });


            // отправка контента
            if (createOffer) {
                const offer = await peerConnections.current[peerID].createOffer();

                await peerConnections.current[peerID].setLocalDescription(offer);

                socket.emit(ACTIONS.RELAY_SDP, {
                    peerID,
                    sessionDescription: offer,
                })
            }
        }

        socket.on(ACTIONS.ADD_PEER, handleNewPeer);
    }, []);

    useEffect(() => {
        async function setRemoteMedia({ peerID, sessionDescription: remoteDescription }) {
            await peerConnections.current[peerID].setRemoteDescription(
                new RTCSessionDescription(remoteDescription)
            )
            if (remoteDescription.type === 'offer') {
                const answer = await peerConnections.current[peerID].createAnswer();

                await peerConnections.current[peerID].setLocalDescription(answer);

                socket.emit(ACTIONS.RELAY_SDP, {
                    peerID,
                    sessionDescription: answer,
                })
            }
        };

        socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia)
    }, [])

    useEffect(() => {
        socket.on(ACTIONS.ICE_CANDIDATE, ({ peerID, iceCandidate }) => {
            peerConnections.current[peerID].addIceCandidate(
                new RTCIceCandidate(iceCandidate)
            )
        });
    }, []);

    useEffect(() => {
        socket.on(ACTIONS.REMOVE_PEER, ({ peerID }) => {
            if (peerConnections.current[peerID]) {
                peerConnections.current[peerID].close();

            }

            delete peerConnections.current[peerID];
            delete peerMediaElements.current[peerID];

            updateClients((list) => list.filter(c => c !== peerID))
        })
    }, [])

    useEffect(() => {
        async function startCapture() {
            console.log(navigator.mediaDevices)
            localMediaStreeam.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });

            addNewClient(LOCAL_VIDEO, () => {
                const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];

                if (localVideoElement) {
                    localVideoElement.voluume = 0;
                    localVideoElement.srcObject = localMediaStreeam.current;
                }
            });
        }

        startCapture()
            .then(() => {
                socket.emit(ACTIONS.JOIN, { room: roomID })
            })
            .catch(err => {
                console.log(err)
            });

        return () => {
            localMediaStreeam.current.getTracks().forEach(track => track.stop());

            socket.emit(ACTIONS.LEAVE);
        }

    }, [roomID]);




    const provideMediaRef = useCallback((id, node) => {
        peerMediaElements.current[id] = node;
    }, [])

    return { clients, provideMediaRef };

}