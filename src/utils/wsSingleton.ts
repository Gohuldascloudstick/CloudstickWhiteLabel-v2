// src/utils/wsSingleton.ts
let socket: WebSocket | null = null;

export function initSocket(url: string, onMessage: (data: any) => void, onOpenPayload: any) {
  console.log('reached herssss');

  if (socket) return socket;
  console.log('==========not here==========================');
  console.log('eeeee');
  console.log('====================================');
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("WS Connected");
    if (onOpenPayload != 'no-data') {
      console.log('esss');
      if (!!onOpenPayload) {
        socket?.send(JSON.stringify(onOpenPayload));
        console.log('sendedndnd');
      }


    }

    // if(type === 'web'){
    //   localStorage.setItem('webInstalionstarted','1')
    // }else if(type === 'delete-webapp'){
    //   localStorage.setItem('webAppDeletionStarted','1') 
    // }

    // else{
    //       localStorage.setItem('serverrInstalionstarted','true')
    // }


  };

  socket.onmessage = (e) => {
    const data = e.data;
    onMessage(data);
  };

  socket.onclose = () => {
    console.log("WS Closed");
    socket = null;
  };

  return socket;
}

export const getSocket = () => socket;

export const closeSocket = () => {
  socket?.close();
  socket = null;
};
