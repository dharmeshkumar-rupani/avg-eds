#!/usr/bin/env node

const OWNER = 'dharmeshkumar-rupani';
const REPO = 'avg-eds';
const DA_ADMIN = 'https://admin.da.live';

const footerHTML = `<body>
<header>
  <div>
    <div>
      <p></p>
    </div>
  </div>
</header>
<main>
  <div>
    <p><picture><source srcset="/.footer/avg-logo-white-v3-1e2f63bb.svg" type="image/svg+xml"><img src="/.footer/avg-logo-white-v3-1e2f63bb.svg" alt="AVG Logo"></picture></p>
    <p>Log in to AVG MyAccount</p>
    <h5>About</h5>
    <ul>
      <li><a href="/en-ww/awards">About AVG</a></li>
      <li><a href="/en-ww/awards">Awards</a></li>
      <li><a href="/en/signal">Blog</a></li>
      <li><a href="/en-ww/contacts">Contact us</a></li>
    </ul>
    <h5>Home Products</h5>
    <ul>
      <li><a href="/en-ww/free-antivirus-download">Free Antivirus Download</a></li>
      <li><a href="/en-ww/internet-security">Internet Security</a></li>
      <li><a href="/en-ww/antivirus-for-android">Android Antivirus</a></li>
      <li><a href="/en-ww/avg-antivirus-for-mac">Free Mac Antivirus</a></li>
      <li><a href="/en-ww/secure-vpn">Secure VPN</a></li>
      <li><a href="/en-ww/avg-pctuneup">TuneUp</a></li>
      <li><a href="/en-ww/installation-files">Installation Files</a></li>
      <li><a href="/en-ww/beta">Beta Downloads</a></li>
      <li><a href="/en-ww/avg-driver-updater">Driver Updater</a></li>
    </ul>
    <h5>Customer Area</h5>
    <ul>
      <li><a href="/en-ww/activation">Register your licenses</a></li>
      <li><a href="/en-ww/activation">Home product support</a></li>
      <li><a href="/en/signal">Security and performance Tips</a></li>
    </ul>
    <h5>Partners and Business</h5>
    <ul>
      <li><a href="/en-ww/business-security">Business Antivirus Software</a></li>
      <li><a href="/en-ww/business-security">Partner Support</a></li>
      <li><a href="/en-ww/business-security">Business Support</a></li>
    </ul>
  </div>
  <hr>
  <div>
    <p><picture><source srcset="/.footer/gen-logo-d6e5eb76.svg" type="image/svg+xml"><img src="/.footer/gen-logo-d6e5eb76.svg" alt="GEN Logo"></picture> AVG is part of Gen - a global company with a family of trusted brands.</p>
    <p>Copyright 2026 Gen Digital Inc. All rights reserved.</p>
    <p><a href="/en-ww/policies">Legal</a> | <a href="/en-ww/privacy">Privacy</a> | <a href="/en-ww/do-not-sell">Your Privacy Choices</a></p>
  </div>
</main>
</body>`;

async function uploadFooter() {
  const url = `${DA_ADMIN}/source/${OWNER}/${REPO}/footer.html`;

  const blob = new Blob([footerHTML], { type: 'text/html' });
  const formData = new FormData();
  formData.append('data', blob, 'footer.html');

  console.log(`Uploading footer to: ${url}`);
  console.log('');
  console.log('NOTE: This script requires DA authentication.');
  console.log('Run this in your browser console while logged into DA,');
  console.log('or use the DA editor to paste the content.');
  console.log('');
  console.log('--- Browser Console Version ---');
  console.log('Copy and paste this into your browser console while on https://da.live:');
  console.log('');

  const browserScript = `
// Run this in your browser console while logged into https://da.live
(async () => {
  const html = ${JSON.stringify(footerHTML)};
  const blob = new Blob([html], { type: 'text/html' });
  const formData = new FormData();
  formData.append('data', blob, 'footer.html');

  const resp = await fetch('${url}', {
    method: 'PUT',
    body: formData,
  });

  if (resp.ok) {
    console.log('Footer uploaded successfully!');
    const result = await resp.json();
    console.log(result);
  } else {
    console.error('Upload failed:', resp.status, await resp.text());
  }
})();
`;

  console.log(browserScript);
}

uploadFooter();
