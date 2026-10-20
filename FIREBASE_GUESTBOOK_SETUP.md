# Firebase 방명록 연결

사이트의 방명록 코드는 준비되어 있습니다. Firebase 프로젝트에 웹 앱과 Cloud Firestore를 등록한 뒤 아래 절차를 완료하면 공개 페이지에서 사용할 수 있습니다.

## 1. 웹 앱 등록

1. Firebase 프로젝트 `freem-ad91b`의 개요 화면으로 이동합니다.
2. 웹 아이콘(`</>`)을 선택하고 앱 이름을 `new-life-invitation`으로 등록합니다.
3. 표시되는 Firebase 설정 객체를 복사합니다.
4. `assets/firebase-config.js`의 `null`을 복사한 설정 객체로 바꿉니다. API 키와 앱 ID는 웹용 공개 설정값입니다. 비밀번호나 서비스 계정 비밀키는 입력하지 마세요.

## 2. Cloud Firestore 만들기

1. Firebase 콘솔에서 Firestore Database를 만듭니다.
2. 한국 방문자에 가까운 위치인 `asia-northeast3 (Seoul)`을 선택합니다. 위치는 만든 뒤 변경할 수 없으니 프로젝트 상황에 맞는지 확인하세요.
3. Database Rules 화면에서 저장소의 `firestore.rules` 내용을 붙여 넣고 게시합니다.

규칙은 최대 50개 최근 글만 공개 조회하고, 이름 24자·메시지 400자까지 신규 등록을 허용합니다. 글은 청첩장 방문자에게 바로 공개되며, 페이지에서 수정·삭제할 수 없습니다. 규칙은 다른 컬렉션에 대한 권한을 열지 않습니다.

## 3. 완료 확인

웹 앱 설정을 `assets/firebase-config.js`에 저장하고 Firestore를 만든 후 사이트를 다시 불러오면 방명록 영역이 표시됩니다. 이 파일은 공개 저장소에 올라가므로 Firebase Security Rules가 방명록 권한을 제한해야 합니다.
