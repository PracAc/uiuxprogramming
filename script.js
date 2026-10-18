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

const themeButton = document.getElementById("themeButton");
const nickNameInput = document.getElementById("nickName");
const nickNameCount = document.getElementById("nickNameCount");
const agreeCheck = document.getElementById("agreeCheck");
const agreeMessage = document.getElementById("agreeMessage");
const startServiceButton = document.getElementById("startServiceButton");

function handleThemeChange() {
  const isDark = document.body.classList.toggle("dark");

  themeButton.textContent = isDark ? "라이트 모드" : "다크 모드";
}

themeButton.addEventListener("click", handleThemeChange);

function handleNicknameInput() {
  const maxLength = nickNameInput.maxLength;
  const currentLength = Math.min(nickNameInput.value.length, maxLength);

  nickNameCount.textContent = `${currentLength} / ${maxLength}`;
}

nickNameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
  const agreed = agreeCheck.checked;

  startServiceButton.disabled = !agreed;
  agreeMessage.textContent = agreed 
  ? "서비스를 이용할 수 있습니다."
  : "서비스 동의 후 서비스 이용이 가능합니다.";

  if (agreed) {
    agreeMessage.classList.add("is-ready");
  } else {
    agreeMessage.classList.remove("is-ready");
  }
}

agreeCheck.addEventListener("change", handleAgreeChange);


const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
  tabs.forEach(function(tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });

  panels.forEach(function(panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.getElementById(targetSelector);

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");

  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

tabs.forEach(function(tab) {
  tab.addEventListener("click", handleTabClick);
});