const socket = io()
const form = document.querySelector('#message-form')



form.addEventListener('submit',(event)=>{
  event.preventDefault()
  const message = event.target.elements.message.value;
  
  socket.emit('sendMessage', message, (error)=>{
    if(error){
      return console.log(error)
    }
    console.log('message delivered')
  })
})


socket.on('message', (data)=>{
  console.log(data)
})


document.querySelector("#send-location").addEventListener('click',()=>{
  if(!navigator.geolocation){
    alert('Geolocation is not supported by your browser')
    return ;
  }

  navigator.geolocation.getCurrentPosition((position)=>{
    socket.emit('sendLocation',{
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },(result)=>{
      console.log(result)
    })
  })
})