import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js';
import {
  addDoc, collection, getDocs, getFirestore, limit, orderBy, query, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

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
  const entries = collection(db, 'guestbook');

  function formatDate(value) {
    if (!value || typeof value.toDate !== 'function') return '';
    return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(value.toDate());
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
    snapshot.forEach(function(doc) {
      const data = doc.data();
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
      list.appendChild(article);
    });
  }

  async function loadEntries() {
    const recent = query(entries, orderBy('createdAt', 'desc'), limit(50));
    renderEntries(await getDocs(recent));
  }

  loadEntries().catch(function() {
    status.textContent = '방명록을 불러오지 못했습니다. 잠시 후 다시 방문해 주세요.';
  });

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    if (document.getElementById('guestbook-website').value) return;
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
      await addDoc(entries, { name, message, createdAt: serverTimestamp() });
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
