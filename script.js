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
  agreeCheck.focus();
}

startServiceButton.addEventListener("click", ()=>{
  if(!agreeCheck.checked)return;
  recordingDialog.showModal();
});

recordingClose.addEventListener("click", () => {
  recordingDialog.close();
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
finishButton.addEventListener("click", ()=>{
  showStep(3);
  addMemo();
});
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



const memoList = document.querySelector("#memo-list");
const memoCount = document.querySelector("#memo-count");
const memoEmpty = document.querySelector("#memo-empty");
const memoMessage = document.querySelector("#memo-message");
const memoThemeButton = document.querySelector("#memo-theme-button");

const memoEditDialog = document.querySelector("#memo-edit-dialog");
const memoEditForm = document.querySelector("#memo-edit-form");
const editMemoTitle = document.querySelector("#edit-memo-title");
const editMemoDuration = document.querySelector("#edit-memo-duration");
const editMemoPriority = document.querySelector("#edit-memo-priority");
const editMemoError = document.querySelector("#edit-memo-error");
const memoEditCancel = document.querySelector("#memo-edit-cancel");

const MEMO_STORAGE_KEY = "mindstore-memos";

let memoData = [];
try {
  const savedMemos = JSON.parse(
    localStorage.getItem(MEMO_STORAGE_KEY) || "[]"
  );
  memoData = Array.isArray(savedMemos) ? savedMemos : [];
} catch (error) {
  memoData = [];
}

let editingMemoId = null;

function getPriorityText(memo) {
  if (!memo.priority) return "설정 안 함";

  const priorityNames = {
    low: "낮음",
    medium: "보통",
    high: "높음"
  };

  return priorityNames[memo.priorityValue] || "보통";
}

function saveMemos() {
  try {
    localStorage.setItem(
      MEMO_STORAGE_KEY,
      JSON.stringify(memoData)
    );
    return true;
  } catch (error) {
    return false;
  }
}

function showMemoMessage(message) {
  memoMessage.textContent = message;
}

function addMemo() {
  const newMemo = {
    id: crypto.randomUUID(),
    title: formData.title,
    duration: formData.duration,
    priority: formData.priority,
    priorityValue: formData.priorityValue
  };

  memoData.push(newMemo);

  const saved = saveMemos();
  renderMemoList();

  showMemoMessage(
    saved
      ? "새로운 메모가 목록에 추가되었습니다."
      : "메모가 추가되었지만 브라우저에 저장하지 못했습니다."
  );
}

function renderMemoList() {
  memoList.replaceChildren();

  memoCount.textContent = `전체 ${memoData.length}개`;
  memoEmpty.hidden = memoData.length > 0;

  if (memoData.length === 0) return;

  const header = document.createElement("div");
  header.className = "memo-table-header";

  ["메모 제목", "기한", "중요도", "관리"].forEach((text) => {
    const column = document.createElement("span");
    column.textContent = text;
    header.appendChild(column);
  });

  memoList.appendChild(header);

  memoData.forEach((memo) => {
    const row = document.createElement("div");
    row.className = "memo-card";

    const title = document.createElement("div");
    title.className = "memo-title";
    title.textContent = memo.title;

    const duration = document.createElement("div");
    duration.className = "memo-duration";
    duration.textContent = `${memo.duration}일`;

    const priority = document.createElement("div");
    priority.className = "memo-priority";
    priority.textContent = getPriorityText(memo);

    const actions = document.createElement("div");
    actions.className = "memo-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "수정";
    editButton.dataset.action = "edit";
    editButton.dataset.id = memo.id;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";
    deleteButton.className = "delete-button";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = memo.id;

    actions.append(editButton, deleteButton);
    row.append(title, duration, priority, actions);
    memoList.appendChild(row);
  });
}

function openMemoEdit(id) {
  const memo = memoData.find((item) => item.id === id);
  if (!memo) return;

  editingMemoId = id;

  editMemoTitle.value = memo.title;
  editMemoDuration.value = memo.duration;
  editMemoPriority.value = memo.priority
    ? memo.priorityValue
    : "none";

  editMemoError.textContent = "";
  memoEditDialog.showModal();
}

memoEditForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newTitle = editMemoTitle.value.trim();

  if (newTitle === "") {
    editMemoError.textContent =
      "메모 제목을 입력한 후 저장해주세요.";
    editMemoTitle.focus();
    return;
  }

  const memo = memoData.find(
    (item) => item.id === editingMemoId
  );

  if (!memo) {
    editMemoError.textContent =
      "수정할 메모를 찾을 수 없습니다.";
    return;
  }

  memo.title = newTitle;
  memo.duration = editMemoDuration.value;
  memo.priority = editMemoPriority.value !== "none";
  memo.priorityValue = memo.priority
    ? editMemoPriority.value
    : "medium";

  const saved = saveMemos();

  renderMemoList();
  memoEditDialog.close();
  editingMemoId = null;

  showMemoMessage(
    saved
      ? "메모가 수정되었습니다."
      : "메모가 수정되었지만 브라우저에 저장하지 못했습니다."
  );
});

memoEditCancel.addEventListener("click", () => {
  memoEditDialog.close();
  editingMemoId = null;
  showMemoMessage("메모 수정을 취소했습니다.");
});

memoEditDialog.addEventListener("close", () => {
  editingMemoId = null;
});

function deleteMemo(id) {
  const memo = memoData.find((item) => item.id === id);
  if (!memo) return;

  const confirmed = confirm(
    `"${memo.title}" 메모를 삭제하시겠습니까?`
  );

  if (!confirmed) {
    showMemoMessage("메모 삭제를 취소했습니다.");
    return;
  }

  memoData = memoData.filter((item) => item.id !== id);

  const saved = saveMemos();
  renderMemoList();

  showMemoMessage(
    saved
      ? "메모가 삭제되었습니다."
      : "메모가 목록에서 삭제되었지만 브라우저에 저장하지 못했습니다."
  );
}

memoList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "edit") {
    openMemoEdit(id);
  } else if (action === "delete") {
    deleteMemo(id);
  }
});

renderMemoList();
updateMemoThemeButton();