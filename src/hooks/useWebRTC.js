import { useEffect, useRef, useState } from "react"
import { useStateWithCallback } from "./useStateWithCallback";

export const useWebRTC = (roomID) => {
    const [clients, updateClient] = useStateWithCallback([]);

    const peerConnection = useRef({});
    const localMediaStreeam = useRef(null);
    const peerMediaElements = useRef({});

    useEffect(() => {

    }, [])

}