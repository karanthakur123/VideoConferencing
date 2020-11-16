const socket = io('/') // for connecting from frontend
const videoGrid = document.getElementById('video-grid')

const myVideo = document.createElement('video')
myVideo.muted = true

const peers={}       



try
{
  navigator.mediaDevices.getUserMedia({    //reference to the camera 
    video: true,
    audio: true
  }).then(stream => {
    addVideoStream(myVideo, stream)
    myPeer.on('call', call => {                           //to show to screens at same time
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)   // custom function which will ad video to the video element 
      })
    })
    socket.on('user-connected', userId => {
      console.log("User Connected " + userId)
      connectToNewUser(userId, stream)
    })
    socket.on('user-disconnected', userId => {      //after socket is diconnected this event is fired
      if (peers[userId]) peers[userId].close()
    })
  
  })
}
catch(error)
  {
    if (error.message) {
    console.log(error.message)
      }
  }
  

function connectToNewUser(userId, stream) {        // To connect user by userId and stream
  try{
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })
  
    peers[userId] = call                      // store the refernce of mypeers={} object
  }
  catch(error)
  {
    if (error.message) {
    console.log(error.message)
      }
  }
  }

function addVideoStream(video, stream) {
  try{
    video.srcObject = stream                          // source object
    video.addEventListener('loadedmetadata', () => {  //whever the vido is loaded the video will play
      video.play()
    })
    videoGrid.append(video) // append the video to the video grid element
  }

  catch(error)
  {
    if (error.message) {
    console.log(error.message)
      }
  }

}
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)     // when user will come it will emit new ids
})
