const socket = io()

let totalClients = document.getElementById("client-total");



const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

function scrollToBottom(){
    messageContainer.scrollTo(0 , messageContainer.scrollHeight);
}



let addMessageUI = (isOwner , data) => {
    clearFeedback();
    let messageClass = isOwner ? "message-right" : "message-left";
    let element = `<li class="${messageClass}">
          <p class="message">
            ${data.message}
            <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
          </p>
        </li>`

    messageContainer.innerHTML += element;    
    scrollToBottom();
}

let sendMessage = () => {
    if(messageInput.value == '') return;
    const data = {
        message : messageInput.value,
        name : nameInput.value ,
        dateTime : new Date()
    }
    socket.emit("message" , data);

    addMessageUI(true , data);
    messageInput.value = '';
}

messageForm.addEventListener("submit" , (e) => {
    e.preventDefault();
    sendMessage();
})


socket.on("message" , (data) => {
    addMessageUI(false , data);
})

socket.on("total-client" , (data) => {
    totalClients.innerHTML = `Total clients: ${data}`;
})
messageInput.addEventListener("focus" , (e) => {
    socket.emit("feedback" , {
        feedback : `${nameInput.value} is typing..`,
    })
})
messageInput.addEventListener("keystroke" , (e) => {
   console.log("hi");
    socket.emit("feedback" , {
        feedback : `${nameInput.value} is typing..`,
    })
})
// messageInput.addEventListener("blur" , (e) => {
//     socket.emit("feedback" , {
//         feedback : ``,
//     })
// })

socket.on('send-feedback', (data) => {
    clearFeedback()
   
    const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `
    console.log(data.feedback);
    messageContainer.innerHTML += element;
    scrollToBottom();
    console.log(messageContainer.innerHTML);
  })
  
 
  
  function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
      element.parentNode.removeChild(element)
    })
  }
