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
    startServiceButton.classList.remove("disabled");
  } else {
    agreeMessage.classList.remove("is-ready");
    startServiceButton.classList.add("disabled");
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

const memoFlow = document.querySelector("#memo-flow");
const flowSteps = memoFlow.querySelectorAll(".step");
const progressItems = memoFlow.querySelectorAll(".progress_item");
const titleInput = document.querySelector("#memo-title");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");
const memoRange = document.querySelector("#memo-range");
const memoValue = document.querySelector("#memo-range-output");
const memoPrioritySetting = document.querySelector("#memo-priority-setting");
const memoPriority = document.querySelector("#memo-priority");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryRange = document.querySelector("#summary-range");
const summaryPrivacy = document.querySelector("#summary-privacy");
const durationValues = ["5","10","15"];

const formData = {
  title : "",
  duration : "5",
  priority : false,
  priorityValue : "medium"
}

function showStep(index){
  flowSteps.forEach((step, i) => { step.hidden = i !== index; });
  progressItems.forEach((item, i) => { 
    item.classList.toggle("is-active", i === index)
  });
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingClose = document.querySelector("#recording-close");
const recordingConfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement(){
  agreeCheck.checked = false;
  memoFlow.hidden = true;
  handleAgreeChange();
  agreeCheck.focus;
}

startServiceButton.addEventListener("click", ()=>{
  if(!agreeCheck.checked)return;
  recordingDialog.showModal();
});

recordingClose.addEventListener("click", () => {
  recordingClose.closest();
  revokeRecordingAgreement();
})

recordingDialog.addEventListener("cancel", revokeRecordingAgreement);
recordingConfirm.addEventListener("click", ()=>{
  if(!agreeCheck.checked)return;
  recordingDialog.close();
  memoFlow.hidden = false;
  showStep(0);
  memoFlow.scrollIntoView({behavior : "smooth"});
  titleInput.focus();
});

function validateTitle(){
  const value = titleInput.value.trim();
  if(!value){
    titleError.textContent = "제목을 입력해주세요.";
    titleError.classList.add("has-error");
    titleInput.focus();
    return false;
  }
  titleError.textContent = "";
  titleError.classList.remove("has-error");
  formData.title = value;
  return true;
};

titleNext.addEventListener("click", () => {
  if(!validateTitle()) return;
  showStep(1);
});

memoRange.addEventListener("input", () => {
  memoValue.value = durationValues[memoRange.value] + "일";
});

memoPrioritySetting.addEventListener("change", () => {
  memoPriority.hidden = !memoPrioritySetting.checked;
});

optionPrev.addEventListener("click", () => {
  showStep(0);
});

optionNext.addEventListener("click", () => {
  formData.duration = durationValues[memoRange.value];
  formData.priority = memoPrioritySetting.checked;
  const priorityValue = document.querySelector('input[name="priority-value"]:checked');
  formData.priorityValue = priorityValue.value;
  summaryTitle.textContent = formData.title;
  summaryRange.textContent = formData.duration + "일";
  summaryPrivacy.textContent = formData.priority? "중요도 : " + formData.priorityValue : "중요도 설정 안 함";
  showStep(2);
});

summaryPrev.addEventListener("click", ()=>{showStep(1);});
finishButton.addEventListener("click", ()=>{showStep(3);});
restartButton.addEventListener("click", ()=>{
  formData.title = "";
  formData.duration = "5";
  formData.priority = false;
  formData.priorityValue = "medium";
  titleInput.value = "";
  titleError.textContent = "";
  titleError.classList.remove("has-error");
  memoRange.value = "1";
  memoValue.value = "5";
  memoPrioritySetting.checked = false;
  memoPriority.hidden = true;
  document.querySelector('input[name="priority-value"][value="medium"]').checked = true;
  summaryTitle.textContent = "";
  summaryRange.textContent = "";
  summaryPrivacy.textContent = "";
  showStep(0);
});