const serviceName = "MindStore";
let isSubscribed = false;
let submitConunt = 0;


function makeSubscribeMessage(email, isSubscribed) {
  if (isSubscribed) {
    return `${email}로 신청이 완료되었습니다.`;
  } 
  
  return `이메일을 입력한 뒤 신청해주세요.`;
}

const subscribeForm = document.getElementById("subscribeForm");
const emailInput = document.getElementById("email");

const subscribeButton = document.getElementById("subscribeButton");
const subscribeMessage = document.getElementById("subscribeMessage");

function handleSubscribe(event) {
  event.preventDefault();

  const subscribeEmail = emailInput.value.trim();

  if (subscribeEmail === "") {
    subscribeMessage.textContent = "이메일을 입력한 뒤 신청해주세요.";
    emailInput.focus();
    return;
  }

  isSubscribed = true;
  submitConunt += 1;

  subscribeMessage.textContent = makeSubscribeMessage(subscribeEmail, isSubscribed);

  subscribeMessage.classList.add("is-success");

  subscribeButton.textContent = "신청 완료";
  subscribeButton.disabled = true;
  subscribeButton.classList.add("disabled");
}

subscribeForm.addEventListener("submit", handleSubscribe);