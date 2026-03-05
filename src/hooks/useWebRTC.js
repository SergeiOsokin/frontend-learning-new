import { useCallback, useEffect, useRef, useState } from "react"
import { useStateWithCallback } from "./useStateWithCallback";
import socket from "../constants/socket";
import { ACTIONS } from "../constants/const";

export const LOCAL_VIDEO = 'LOCAL_VIDEO';

export const useWebRTC = (roomID) => {
    const [clients, updateClients] = useStateWithCallback([]);

    const peerConnection = useRef({});
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

    }, [roomID]);

    const provideMediaRef = useCallback((id, node) => {
        peerMediaElements.current[id] = node;
    }, [])

    return { clients, provideMediaRef };

}