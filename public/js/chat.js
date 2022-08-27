const socket = io()
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages');



// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
$messageForm.addEventListener('submit',(event)=>{
  event.preventDefault()
  const message = event.target.elements.message.value;

  // disabling the button until the request is being sent to the server
  $messageFormButton.setAttribute('disabled', 'disabled');
  
  socket.emit('sendMessage', message, (error)=>{
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus();
    if(error){
      return console.log(error)
    }
    console.log('message delivered')
  })
})


socket.on('message', (data)=>{
  console.log(data)
  const html = Mustache.render(messageTemplate,{
    message: data.text,
    createdAt: moment(data.createAt).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend', html)
})

socket.on("locationMessage", (data) => {
  console.log(data);
  const html = Mustache.render(locationMessageTemplate, {
    locationUrl: data.url,
    createdAt: moment(data.createdAt).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend', html)
});


$sendLocationButton.addEventListener('click',()=>{
  if(!navigator.geolocation){
    alert('Geolocation is not supported by your browser')
    return ;
  }
  $sendLocationButton.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position)=>{
    socket.emit('sendLocation',{
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },(result)=>{
      $sendLocationButton.removeAttribute('disabled')
      console.log(result)
    })
  })
})