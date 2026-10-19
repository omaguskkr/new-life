# 조용호 · 황예은 모바일 청첩장

2027년 10월 9일 토요일 오후 5시, 서울대학교 호암교수회관을 기준으로 제작한 모바일 우선 반응형 청첩장입니다.

## 무료 GitHub Pages 게시

저장소: https://github.com/omaguskkr/new-life  
예상 공개 주소: https://omaguskkr.github.io/new-life/

### Pages 활성화
1. 저장소의 **Settings**를 엽니다.
2. 왼쪽 메뉴에서 **Pages**를 선택합니다.
3. **Build and deployment → Source**에서 **Deploy from a branch**를 선택합니다.
4. **Branch**는 \`main\`, 폴더는 \`/(root)\`로 선택하고 **Save**를 누릅니다.
5. 배포가 진행된 뒤 위 공개 주소를 엽니다. 첫 배포에 몇 분이 걸릴 수 있습니다.

## 구성과 기능
- \`index.html\`: 모든 스타일과 JavaScript가 포함된 반응형 단일 페이지
- \`assets/floral-illustration.svg\`: 메인 식물 일러스트
- \`assets/floral-divider.svg\`: 섹션 장식
- 결혼식 카운트다운, 사진 갤러리/확대 보기, 지도 링크, 시스템 공유/링크 복사 기능
- 참석 회신과 계좌 정보는 확정되지 않아 자리 표시 안내만 보입니다.

## 나중에 정보 추가하기

모바일 청첩장 본문 아래쪽 \`index.html\`의 \`WEDDING_CONFIG\` 설정을 수정합니다.

- RSVP: \`rsvpFormUrl: ''\`에 무료 Google Forms의 실제 응답 링크를 입력합니다.
- 사진: \`galleryImages: []\` 배열에 사진 파일 경로와 설명을 추가합니다. 사진은 저장소 \`assets\` 폴더에 업로드하세요.
- 계좌: \`accounts: []\`에 실제로 공개하기로 결정한 계좌 정보를 추가합니다.

예를 들어 RSVP는 \`rsvpFormUrl: 'https://docs.google.com/forms/d/e/실제폼ID/viewform'\`처럼 입력합니다. 사진/계좌 예시는 실제 정보로 교체해야 합니다. 불확실한 정보는 임의로 작성하지 않았습니다.

GitHub Pages는 정적 사이트 호스팅이므로 응답 데이터를 자체 저장하지 않습니다. 참석 여부는 Google Forms 등 별도 서비스가 필요합니다.

## 장소 정보
지도 버튼은 네이버 지도, 카카오맵, Google 지도에서 **서울대학교 호암교수회관**을 검색하도록 연결되어 있습니다. 세부 홀과 교통 안내는 확정되지 않아 넣지 않았습니다.

## 개인정보
공개 저장소와 GitHub Pages 웹사이트는 누구나 볼 수 있습니다. 실제 사진, 계좌번호, 연락처를 넣기 전에 공개 여부를 꼭 확인하세요. 