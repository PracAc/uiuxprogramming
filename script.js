const storageKey = 'mindstore-memos';
const form = document.querySelector('#plan-form');
const steps = [...document.querySelectorAll('.flow-step')];
const progressItems = [...document.querySelectorAll('.progress-item')];
const titleInput = document.querySelector('#presentation-title');
const titleError = document.querySelector('#title-error');
const titleCount = document.querySelector('#title-count');
const durationRange = document.querySelector('#duration-range');
const durationOutput = document.querySelector('#duration-output');
const priorityOption = document.querySelector('#priority-option');
const priorityOptions = document.querySelector('#priority-options');
const planList = document.querySelector('#plan-list');
const emptyState = document.querySelector('#empty-state');
const planCount = document.querySelector('#plan-count');
const archiveStatus = document.querySelector('#archive-status');
const durationValues = ['5', '10', '15'];
const priorityNames = { low: '낮음', medium: '보통', high: '높음' };
const navLinks = document.querySelectorAll('.main-nav a');
const menuToggle = document.querySelector('#menu-toggle');
const mainNav = document.querySelector('#main-nav');
const filterButtons = document.querySelectorAll('.filter-button');
let currentFilter = 'all';



function readPlans() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter(plan => plan && (typeof plan.id === 'string' || typeof plan.id === 'number') && typeof plan.title === 'string')
      .map(plan => ({
        id: String(plan.id),
        title: plan.title.slice(0, 100),
        duration: durationValues.includes(String(plan.duration)) ? String(plan.duration) : '10',
        priority: plan.priority === true,
        priorityValue: Object.prototype.hasOwnProperty.call(priorityNames, plan.priorityValue) ? plan.priorityValue : 'medium'
      }));
  } catch {
    return [];
  }
}

let plans = readPlans();
let currentStep = 1;
let editingMemoId = null;

function savePlans() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(plans));
    return true;
  } catch {
    return false;
  }
}

function showStep(number) {
  currentStep = number;
  steps.forEach(step => { step.hidden = Number(step.dataset.step) !== number; });
  progressItems.forEach((item, index) => {
    const isCurrent = index === number - 1;
    item.classList.toggle('is-current', isCurrent);
    item.classList.toggle('is-done', index < number - 1);
    if (isCurrent && number <= 3) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  const heading = steps[number - 1].querySelector('h3');
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  document.querySelector('#planner').scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function validateTitle() {
  const title = titleInput.value.trim();
  if (!title) {
    titleError.textContent = '메모 제목을 입력해 주세요. 공백만으로는 저장할 수 없습니다.';
    titleInput.setAttribute('aria-invalid', 'true');
    titleInput.focus();
    return false;
  }
  if (title.length < 2) {
    titleError.textContent = '메모 제목은 2자 이상 입력해 주세요.';
    titleInput.setAttribute('aria-invalid', 'true');
    titleInput.focus();
    return false;
  }
  titleError.textContent = '';
  titleInput.removeAttribute('aria-invalid');
  return true;
}

function getFormValues() {
  return {
    title: titleInput.value.trim(),
    duration: durationValues[Number(durationRange.value)],
    priority: priorityOption.checked,
    priorityValue: form.querySelector('input[name="priority-value"]:checked').value
  };
}

function priorityText(plan) {
  return plan.priority ? (priorityNames[plan.priorityValue] || '보통') : '설정 안 함';
}

function updateSummary() {
  const values = getFormValues();
  document.querySelector('#summary-title').textContent = values.title;
  document.querySelector('#summary-duration').textContent = `${values.duration}일`;
  document.querySelector('#summary-priority').textContent = priorityText(values);
}

titleInput.addEventListener('input', () => {
  titleCount.textContent = `${titleInput.value.length} / 60자`;
  if (titleInput.getAttribute('aria-invalid') === 'true') validateTitle();
});

durationRange.addEventListener('input', () => {
  durationOutput.value = `${durationValues[Number(durationRange.value)]}일`;
});

priorityOption.addEventListener('change', () => {
  priorityOptions.hidden = !priorityOption.checked;
});

form.addEventListener('submit', event => {
  event.preventDefault();
  if (currentStep === 1) document.querySelector('#info-next').click();
});

document.querySelector('#info-next').addEventListener('click', () => {
  if (validateTitle()) showStep(2);
});
document.querySelector('#option-prev').addEventListener('click', () => showStep(1));
document.querySelector('#option-next').addEventListener('click', () => {
  updateSummary();
  showStep(3);
});
document.querySelector('#edit-info').addEventListener('click', () => showStep(1));
document.querySelector('#edit-options').addEventListener('click', () => showStep(2));

document.querySelector('#save-plan').addEventListener('click', () => {
  if (!validateTitle()) {
    showStep(1);
    titleInput.focus();
    return;
  }
  const plan = {
    id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    ...getFormValues()
  };
  plans.unshift(plan);
  const persisted = savePlans();
  renderPlans();
  archiveStatus.textContent = persisted
    ? `‘${plan.title}’ 메모를 저장했습니다.`
    : '메모가 현재 화면에만 저장되었습니다. 브라우저 저장 공간 오류로 새로고침하면 사라질 수 있습니다.';
  document.querySelector('#complete-message').textContent = `‘${plan.title}’ 메모를 내 메모 목록에서 확인할 수 있습니다.`;
  showStep(4);
});

document.querySelector('#restart-button').addEventListener('click', () => {
  form.reset();
  priorityOptions.hidden = true;
  durationOutput.value = '10일';
  titleError.textContent = '';
  titleCount.textContent = '0 / 60자';
  titleInput.removeAttribute('aria-invalid');
  showStep(1);
  titleInput.focus();
});

// 3. 수업의 createText / renderPlans 흐름 + MindStore 수정/삭제 기능
function createText(tag, className, content) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = content;
  return element;
}

function updateCurrentNav () {
  const currentHash = window.location.hash;

  navLinks.forEach((link) => {
    const current = currentHash
    ? link.getAttribute('href') === currentHash
    : link === navLinks[0];

    link.classList.toggle('is-current', current);

    if(current){
      link.setAttribute('aria-current', 'page');
    }else{
      link.removeAttribute('aria-current');
    }
  });
}

window.addEventListener('hashchange', updateCurrentNav);
updateCurrentNav();

menuToggle.addEventListener('click',() => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.textContent = isOpen ? "메뉴 닫기" : "메뉴 열기";
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle.textContent = "메뉴 열기";
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

function getVisiblePlans() {
  return plans.filter((plan) => {
    if(currentFilter === 'all') return true;
    if(currentFilter === 'canceled') return plan.canceled;
    return !plan.canceled;
  });
}

function renderPlans() {
  const visiblePlans = getVisiblePlans();

  planList.replaceChildren();
  emptyState.hidden = visiblePlans.length !== 0;
  planList.hidden = visiblePlans.length === 0;

  const emptyTitle = emptyState.querySelector('h3');
  const emptyDescription = emptyState.querySelector('p');
  const emptyAction = emptyState.querySelector('a');

  if(visiblePlans.length === 0){
    const filtered = currentFilter !== 'all';
    emptyTitle.textContent = filtered 
    ? "선택한 상태에 메모가 없습니다." 
    : "아직 저장한 메모가 없습니다.";

    emptyDescription.textContent = filtered
    ? "다른 상태를 선택해 주십시오."
    : "첫 메모를 작성하면 이곳에서 볼 수 있습니다.";

    emptyAction.hidden = filtered;
  }

  planCount.textContent = String(visiblePlans.length);
  planCount.setAttribute(
    'aria-label',
    `저장한 메모 ${plans.length}개`
  )

  const header = createText('div', 'memo-table-header', '');
  ['메모 제목', '기한', '중요도', '관리'].forEach(label => {
    header.append(createText('span', '', label));
  });
  planList.append(header);

  visiblePlans.forEach(plan => {
    const row = createText('div', 'memo-card', '');
    row.append(createText('div', 'memo-title', plan.title));
    row.append(createText('div', 'memo-duration', `${plan.duration}일`));
    row.append(createText('div', 'memo-priority', priorityText(plan)));
    const actions = createText('div', 'memo-actions', '');
    const editButton = createText('button', 'button button-secondary', '수정');
    editButton.type = 'button';
    editButton.dataset.action = 'edit';
    editButton.dataset.id = plan.id;
    const deleteButton = createText('button', 'button delete-button', '삭제');
    deleteButton.type = 'button';
    deleteButton.dataset.action = 'delete';
    deleteButton.dataset.id = plan.id;
    actions.append(editButton, deleteButton);
    row.append(actions);
    planList.append(row);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });

    renderPlans();
  });
});

const memoEditDialog = document.querySelector('#memo-edit-dialog');
const memoEditForm = document.querySelector('#memo-edit-form');
const editMemoTitle = document.querySelector('#edit-memo-title');
const editMemoDuration = document.querySelector('#edit-memo-duration');
const editMemoPriority = document.querySelector('#edit-memo-priority');
const editMemoError = document.querySelector('#edit-memo-error');

planList.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button || !planList.contains(button)) return;
  const plan = plans.find(item => item.id === button.dataset.id);
  if (!plan) return;

  if (button.dataset.action === 'edit') {
    editingMemoId = plan.id;
    editMemoTitle.value = plan.title;
    editMemoDuration.value = plan.duration;
    editMemoPriority.value = plan.priority ? plan.priorityValue : 'none';
    editMemoError.textContent = '';
    memoEditDialog.showModal();
    return;
  }

  if (button.dataset.action === 'delete') {
    if (!window.confirm(`‘${plan.title}’ 메모를 삭제하시겠습니까?`)) return;
    plans = plans.filter(item => item.id !== plan.id);
    const persisted = savePlans();
    renderPlans();
    archiveStatus.textContent = persisted ? '메모가 삭제되었습니다.' : '화면에서 삭제했지만 저장 공간 오류로 새로고침하면 복구될 수 있습니다.';
  }
});

memoEditForm.addEventListener('submit', event => {
  event.preventDefault();
  const title = editMemoTitle.value.trim();
  if (title.length < 2) {
    editMemoError.textContent = '메모 제목은 2자 이상 입력해 주세요.';
    editMemoTitle.focus();
    return;
  }
  const plan = plans.find(item => item.id === editingMemoId);
  if (!plan) {
    editMemoError.textContent = '수정할 메모를 찾을 수 없습니다.';
    return;
  }
  plan.title = title;
  plan.duration = editMemoDuration.value;
  plan.priority = editMemoPriority.value !== 'none';
  plan.priorityValue = plan.priority ? editMemoPriority.value : 'medium';
  const persisted = savePlans();
  renderPlans();
  memoEditDialog.close();
  archiveStatus.textContent = persisted ? '메모가 수정되었습니다.' : '화면에서 수정했지만 브라우저 저장 공간에 반영하지 못했습니다.';
});

document.querySelector('#memo-edit-cancel').addEventListener('click', () => memoEditDialog.close());
memoEditDialog.addEventListener('close', () => { editingMemoId = null; });

const tabs = [...document.querySelectorAll('.tab')];
const panels = [...document.querySelectorAll('.panel')];
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      const active = panel.id === tab.dataset.target;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  });
});

const themeButton = document.querySelector('#themeButton');
themeButton.addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark');
  themeButton.textContent = dark ? '라이트 모드' : '다크 모드';
  themeButton.setAttribute('aria-pressed', String(dark));
});

const nickNameInput = document.querySelector('#nickName');
const nickNameCount = document.querySelector('#nickNameCount');
nickNameInput.addEventListener('input', () => {
  nickNameCount.textContent = `${nickNameInput.value.length} / 10`;
});

const agreeCheck = document.querySelector('#agreeCheck');
const agreeMessage = document.querySelector('#agreeMessage');
const startServiceButton = document.querySelector('#startServiceButton');
const recordingDialog = document.querySelector('#recording-dialog');
const planner = document.querySelector('#planner');

function handleAgreeChange() {
  const agreed = agreeCheck.checked;
  startServiceButton.disabled = !agreed;
  startServiceButton.classList.toggle('disabled', !agreed);
  agreeMessage.classList.toggle('is-ready', agreed);
  agreeMessage.textContent = agreed ? '메모 작성을 시작할 수 있습니다.' : '안내 확인 후 서비스를 이용할 수 있습니다.';
}

agreeCheck.addEventListener('change', handleAgreeChange);
startServiceButton.addEventListener('click', () => {
  if (agreeCheck.checked) recordingDialog.showModal();
});
document.querySelector('#recording-close').addEventListener('click', () => {
  recordingDialog.close();
  agreeCheck.checked = false;
  handleAgreeChange();
});
document.querySelector('#recording-confirm').addEventListener('click', () => {
  if (!agreeCheck.checked) return;
  recordingDialog.close();
  planner.hidden = false;
  showStep(1);
});

const subscribeForm = document.querySelector('#subscribeForm');
const emailInput = document.querySelector('#email');
const subscribeButton = document.querySelector('#subscribeButton');
const subscribeMessage = document.querySelector('#subscribeMessage');
subscribeForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!emailInput.checkValidity()) {
    subscribeMessage.textContent = '올바른 이메일을 입력해 주세요.';
    subscribeMessage.classList.remove('is-success');
    emailInput.focus();
    return;
  }
  subscribeMessage.textContent = `${emailInput.value.trim()}로 신청이 완료되었습니다. (화면 실습용)`;
  subscribeMessage.classList.add('is-success');
  subscribeButton.textContent = '신청 완료';
  subscribeButton.disabled = true;
});

handleAgreeChange();
renderPlans();
