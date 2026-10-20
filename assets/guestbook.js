import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js';
import {
  addDoc, collection, deleteDoc, getDocs, getFirestore, limit, orderBy,
  query, serverTimestamp, updateDoc
} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js?v=20261020';

const section = document.getElementById('guestbook-section');
const form = document.getElementById('guestbook-form');
const list = document.getElementById('guestbook-list');
const status = document.getElementById('guestbook-status');
const submitButton = document.getElementById('guestbook-submit');
const configured = firebaseConfig && firebaseConfig.apiKey && firebaseConfig.appId && firebaseConfig.projectId;

if (configured) {
  section.hidden = false;
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const entries = collection(db, 'guestbook');
  const authState = { user: null, ready: false, signInStarted: false, resolveReady: null };
  const authReady = new Promise(function(resolve) { authState.resolveReady = resolve; });
  submitButton.disabled = true;

  function finishAuth(user) {
    authState.user = user;
    if (!authState.ready) {
      authState.ready = true;
      authState.resolveReady(user);
    }
  }

  function formatDate(value) {
    if (!value || typeof value.toDate !== 'function') return '';
    return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(value.toDate());
  }

  function actionButton(label, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'guestbook-entry-action ' + className;
    button.textContent = label;
    return button;
  }

  function startEditing(entry, article, data, actions) {
    actions.hidden = true;
    const editor = document.createElement('form');
    editor.className = 'guestbook-edit-form';

    const nameLabel = document.createElement('label');
    nameLabel.className = 'guestbook-field';
    nameLabel.textContent = '이름';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.maxLength = 24;
    nameInput.required = true;
    nameInput.value = data.name;
    nameLabel.appendChild(nameInput);

    const messageLabel = document.createElement('label');
    messageLabel.className = 'guestbook-field';
    messageLabel.textContent = '축하 메시지';
    const messageInput = document.createElement('textarea');
    messageInput.maxLength = 400;
    messageInput.required = true;
    messageInput.value = data.message;
    messageLabel.appendChild(messageInput);

    const controls = document.createElement('div');
    controls.className = 'guestbook-edit-actions';
    const save = actionButton('수정 내용 저장', 'guestbook-save');
    save.type = 'submit';
    const cancel = actionButton('취소', 'guestbook-cancel');
    controls.append(save, cancel);
    editor.append(nameLabel, messageLabel, controls);

    cancel.addEventListener('click', function() { loadEntries(); });
    editor.addEventListener('submit', async function(event) {
      event.preventDefault();
      const name = nameInput.value.trim();
      const message = messageInput.value.trim();
      if (!name || !message) {
        status.textContent = '이름과 메시지를 입력해 주세요.';
        return;
      }
      if (!authState.user || data.authorUid !== authState.user.uid) {
        status.textContent = '작성자만 메시지를 수정할 수 있습니다.';
        return;
      }
      save.disabled = true;
      status.textContent = '수정 내용을 저장하고 있습니다.';
      try {
        await updateDoc(entry.ref, { name, message });
        status.textContent = '메시지를 수정했습니다.';
        await loadEntries();
      } catch (error) {
        save.disabled = false;
        status.textContent = '수정에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      }
    });
    article.appendChild(editor);
    nameInput.focus();
  }

  function renderEntries(snapshot) {
    list.replaceChildren();
    if (snapshot.empty) {
      const empty = document.createElement('p');
      empty.className = 'guestbook-empty';
      empty.textContent = '아직 남겨진 메시지가 없습니다. 첫 축하 메시지를 남겨주세요.';
      list.appendChild(empty);
      return;
    }
    snapshot.forEach(function(entry) {
      const data = entry.data();
      const article = document.createElement('article');
      article.className = 'guestbook-entry';
      const header = document.createElement('div');
      header.className = 'guestbook-entry-head';
      const name = document.createElement('p');
      name.className = 'guestbook-entry-name';
      name.textContent = data.name;
      const date = document.createElement('p');
      date.className = 'guestbook-entry-date';
      date.textContent = formatDate(data.createdAt);
      const message = document.createElement('p');
      message.className = 'guestbook-entry-message';
      message.textContent = data.message;
      header.append(name, date);
      article.append(header, message);

      if (authState.user && data.authorUid === authState.user.uid) {
        const actions = document.createElement('div');
        actions.className = 'guestbook-entry-actions';
        const editButton = actionButton('수정', 'guestbook-edit');
        const deleteButton = actionButton('삭제', 'guestbook-delete');
        editButton.addEventListener('click', function() { startEditing(entry, article, data, actions); });
        deleteButton.addEventListener('click', async function() {
          if (!authState.user || data.authorUid !== authState.user.uid) return;
          if (!window.confirm('이 축하 메시지를 삭제할까요?')) return;
          deleteButton.disabled = true;
          try {
            await deleteDoc(entry.ref);
            status.textContent = '메시지를 삭제했습니다.';
            await loadEntries();
          } catch (error) {
            deleteButton.disabled = false;
            status.textContent = '삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.';
          }
        });
        actions.append(editButton, deleteButton);
        article.appendChild(actions);
      }
      list.appendChild(article);
    });
  }

  async function loadEntries() {
    try {
      const recent = query(entries, orderBy('createdAt', 'desc'), limit(50));
      renderEntries(await getDocs(recent));
    } catch (error) {
      status.textContent = '방명록을 불러오지 못했습니다. 잠시 후 다시 방문해 주세요.';
    }
  }

  loadEntries();

  onAuthStateChanged(auth, async function(user) {
    if (user) {
      finishAuth(user);
      submitButton.disabled = false;
      if (!status.textContent) status.textContent = '';
      await loadEntries();
      return;
    }
    submitButton.disabled = true;
    if (!authState.signInStarted) {
      authState.signInStarted = true;
      try {
        const credential = await signInAnonymously(auth);
        finishAuth(credential.user);
      } catch (error) {
        finishAuth(null);
        status.textContent = '작성자 확인을 준비하지 못했습니다. 메시지는 읽을 수 있지만 등록·수정·삭제는 사용할 수 없습니다.';
      }
    }
  });

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    if (document.getElementById('guestbook-website').value) return;
    const user = authState.user || await authReady;
    if (!user) {
      status.textContent = '작성자 확인을 준비하지 못했습니다. 새로고침 후 다시 시도해 주세요.';
      return;
    }
    const name = document.getElementById('guestbook-name').value.trim();
    const message = document.getElementById('guestbook-message').value.trim();
    if (!name || !message) {
      status.textContent = '이름과 메시지를 입력해 주세요.';
      return;
    }
    const key = 'new-life-guestbook-last-submit';
    const lastSubmit = Number(localStorage.getItem(key) || 0);
    if (Date.now() - lastSubmit < 30000) {
      status.textContent = '잠시 후 다시 메시지를 남겨주세요.';
      return;
    }
    submitButton.disabled = true;
    status.textContent = '메시지를 등록하고 있습니다.';
    try {
      await addDoc(entries, { name, message, authorUid: user.uid, createdAt: serverTimestamp() });
      localStorage.setItem(key, String(Date.now()));
      form.reset();
      status.textContent = '축하 메시지를 남겨주셔서 감사합니다.';
      await loadEntries();
    } catch (error) {
      status.textContent = '등록에 실패했습니다. 잠시 후 다시 시도해 주세요.';
    } finally {
      submitButton.disabled = false;
    }
  });
}
