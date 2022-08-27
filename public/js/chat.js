const socket = io();
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  $messages.scrollTop = $messages.scrollHeight;
  // const $newMessage = $messages.lastElementChild;
  // const newMessageStyles = getComputedStyle($newMessage);
  // const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  // const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
  // console.log(newMessageHeight);

  // const visibleHeight = $messages.offsetHeight;
  // console.log('visibleHeight: ' + visibleHeight)

  // const containerHeight = $messages.scrollHeight;
  // console.log(`containerHeight: ${containerHeight}`)

  // const scrollOffset = $messages.scrollTop + visibleHeight;
  // console.log(`scrollOffset: ${scrollOffset}`)

  // if(containerHeight - newMessageHeight <= scrollOffset){
  //   console.log('scroll')
  //   $messages.scrollTop = $messages.scrollHeight
  // }
};

$messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = event.target.elements.message.value;

  // disabling the button until the request is being sent to the server
  $messageFormButton.setAttribute("disabled", "disabled");

  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }
    // console.log("message delivered");
  });
});

socket.on("message", (data) => {
  // console.log(data);
  const html = Mustache.render(messageTemplate, {
    username: data.username,
    message: data.text,
    createdAt: moment(data.createAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", (data) => {
  // console.log(data);
  const html = Mustache.render(locationMessageTemplate, {
    username: data.username,
    locationUrl: data.url,
    createdAt: moment(data.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  $sidebar.innerHTML = html;
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }
  $sendLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (result) => {
        $sendLocationButton.removeAttribute("disabled");
        // console.log(result);
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
