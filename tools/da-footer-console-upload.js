// IMPORTANT: Run this from the browser console while on https://da.live/#/dharmeshkumar-rupani/avg-eds
// (You MUST be on the da.live domain for auth cookies to be sent)
// Step 1: Navigate to https://da.live/#/dharmeshkumar-rupani/avg-eds
// Step 2: Open DevTools (F12) > Console tab
// Step 3: Paste this entire script and press Enter

(async () => {
  // Try to get the auth token from DA's IMS
  let token;
  try {
    const { loadIms, handleSignIn } = await import('https://da.live/blocks/shared/utils.js');
    await loadIms();
    token = window.adobeIMS?.getAccessToken()?.token;
  } catch (e) {
    console.log('Could not get token from IMS, trying without...');
  }

  const html = `<body>
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

  const blob = new Blob([html], { type: 'text/html' });
  const formData = new FormData();
  formData.append('data', blob, 'footer.html');

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('Using IMS token for authentication');
  }

  const resp = await fetch('https://admin.da.live/source/dharmeshkumar-rupani/avg-eds/footer.html', {
    method: 'PUT',
    headers,
    body: formData,
  });

  if (resp.ok) {
    const result = await resp.json();
    console.log('%c Footer uploaded successfully!', 'color: green; font-weight: bold;', result);
    console.log('Now go to: https://da.live/edit#/dharmeshkumar-rupani/avg-eds/footer');
  } else {
    console.error('Upload failed:', resp.status, await resp.text());
    console.log('%c Make sure you are on https://da.live and logged in with your Adobe ID', 'color: orange;');
  }
})();
